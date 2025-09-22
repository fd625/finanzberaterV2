<template>
    <div class="login">
        <PopUp 
            class="login__popup" 
            @close-popup="$emit('close-popup')" 
            @submit="register"
            label="Registrieren" 
            submitHeadline="Registrieren"
        >
            <template v-slot:form>
                <div class="login__popup__container">
                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>
                    
                    <div v-if="loading" class="loading-message">
                        Registrierung läuft...
                    </div>
                    
                    <p>Email:</p>
                    <InputText 
                        name="email" 
                        type="email" 
                        placeholder="beispiel@email.com" 
                        v-model="email" 
                        :disabled="loading"
                        required
                    />
                    <p>Benutzername:</p>
                    <InputText 
                        name="username" 
                        type="text" 
                        placeholder="Dein Benutzername" 
                        v-model="username" 
                        :disabled="loading"
                        required
                    />
                    <p>Gehalt:</p>
                    <InputText 
                        name="salary" 
                        type="number" 
                        placeholder="50000" 
                        v-model="salary" 
                        :disabled="loading"
                    />
                    <p>Password:</p>
                    <InputText 
                        name="password" 
                        type="password" 
                        placeholder="Mindestens 6 Zeichen" 
                        v-model="password" 
                        :disabled="loading"
                        required
                    />
                </div>
            </template>
        </PopUp>
    </div>
</template>

<script>
import PopUp from './PopUp.vue';
import InputText from 'primevue/inputtext';
import { supabase } from '../database.js';

export default { 
    name: "PopUp-Register",
    data() {
        return {
            username: "",
            password: "",
            email: "",
            salary: "",
            loading: false,
            error: null
        }
    },
    components: {
        PopUp,
        InputText
    },
    methods: {
        async register() {
            console.log("Register method called");
            
            this.error = null;
            
            if (!this.email || !this.username || !this.password) {
                this.error = "Bitte füllen Sie alle Pflichtfelder aus.";
                return;
            }
            
            if (this.password.length < 6) {
                this.error = "Das Passwort muss mindestens 6 Zeichen lang sein.";
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.email)) {
                this.error = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
                return;
            }
            
            this.loading = true;
            
            console.log("Attempting to register with:", {
                email: this.email,
                username: this.username,
                salary: this.salary
            });
            
            try {
                const { data, error } = await supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                    options: {
                        data: {
                            username: this.username,
                            salary: this.salary ? parseFloat(this.salary) : null
                        }
                    }
                });
                
                console.log("Supabase response:", { data, error });
                
                if (error) {
                    console.error("Supabase error:", error);
                    throw error;
                }
                
                if (data.user) {
                    console.log("Registration successful:", data.user);
                    
                    if (!data.session) {
                        this.error = "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail für die Bestätigung.";
                        setTimeout(() => {
                            this.$emit('close-popup');
                        }, 3000);
                    } else {
                        alert("Registrierung erfolgreich!");
                        this.$emit('close-popup');
                    }
                }
                
            } catch (error) {
                console.error("Registration error:", error);
                this.error = this.getErrorMessage(error);
            } finally {
                this.loading = false;
            }
        },
        
        getErrorMessage(error) {
            switch (error.message) {
                case 'User already registered':
                    return 'Diese E-Mail-Adresse ist bereits registriert.';
                case 'Password should be at least 6 characters':
                    return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
                case 'Invalid email':
                    return 'Ungültige E-Mail-Adresse.';
                case 'Signup is disabled':
                    return 'Registrierung ist derzeit deaktiviert.';
                case 'Email rate limit exceeded':
                    return 'Zu viele Registrierungsversuche. Bitte warten Sie einen Moment.';
                default:
                    return error.message || 'Ein unbekannter Fehler ist aufgetreten.';
            }
        }
    }
}
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
            &:hover {
                cursor: pointer;
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
    margin-bottom: 10px;
    
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