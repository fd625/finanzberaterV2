<template>
  <div class="login">
    <PopUp 
      class="login__popup" 
      label="Login" 
      submit-headline="Login"
      @close-popup="$emit('close-popup')"
      @submit="login"
    >
      <template #form>
        <div class="login__popup__container">
          <div
            v-if="error"
            class="error-message"
          >
            {{ error }}
          </div>
                    
          <div
            v-if="loading"
            class="loading-message"
          >
            Anmeldung läuft...
          </div>
                    
          <div>
            <p>E-Mail:</p>
            <InputText 
              v-model="email" 
              name="email" 
              type="email" 
              placeholder="beispiel@email.com" 
              :disabled="loading"
              required
            />
          </div>
          <div>
            <p>Password:</p>
            <InputText 
              v-model="password" 
              name="password" 
              type="password" 
              placeholder="Ihr Passwort" 
              :disabled="loading"
              required
            />
          </div>
          <p
            class="login__popup__container__register"
            @click="$emit('register')"
          >
            Noch kein Konto? Registrieren
          </p>
        </div>
      </template>
    </PopUp>
  </div>
</template>

<script>
import PopUp from "./PopUp.vue";
import InputText from "primevue/inputtext";
import { supabase } from "../database.js";

export default { 
    name: "PopUpLogin",
    components: {
        PopUp,
        InputText
    },
    data() {
        return {
            email: "",
            password: "",
            loading: false,
            error: null
        };
    },
    methods: {
        async login() {
            this.error = null;
            
            if (!this.email || !this.password) {
                this.error = "Bitte füllen Sie alle Felder aus.";
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.error = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
                return;
            }
            
            this.loading = true;
            
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: this.email,
                    password: this.password
                });
                
                console.log("Supabase login response:", { data, error });
                
                if (error) {
                    console.error("Supabase login error:", error);
                    throw error;
                }
                
                    this.$emit("close-popup");
                    this.$emit("login-success", data.user);
                }
                
            } catch (error) {
                console.error("Login error:", error);
                this.error = this.getErrorMessage(error);
            } finally {
                this.loading = false;
            }
        },
        
        getErrorMessage(error) {
            switch (error.message) {
                case "Invalid login credentials":
                    return "Ungültige E-Mail oder Passwort.";
                case "Email not confirmed":
                    return "Bitte bestätigen Sie Ihre E-Mail-Adresse.";
                case "Too many requests":
                    return "Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.";
                case "Invalid email":
                    return "Ungültige E-Mail-Adresse.";
                default:
                    return error.message || "Ein unbekannter Fehler ist aufgetreten.";
            }
        }
    }
};
</script>

<style lang="scss">
.login__popup {
    height: 100%;
    width: 100%;
    &__container {
        .error-message {
            background-color: #fee;
            color: #c00;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #fcc;
            font-size: 14px;
        }
        
        .loading-message {
            background-color: #e6f3ff;
            color: #0066cc;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 14px;
        }
        
        &__register {
            color: rgb(4, 4, 146);
            text-decoration: underline;
            margin: 20px 0;
            cursor: pointer;
            &:hover {
                color: rgb(7, 7, 213);
            }
        }
    }
}

.p-inputtext {
    border: 1px solid grey !important;
    padding: 8px !important;
    border-radius: 3px !important;
    width: 100%;
    
    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
}

p {
    margin: 10px 0 5px 0;
    font-weight: bold;
}
</style>