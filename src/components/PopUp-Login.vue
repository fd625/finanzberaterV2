<template>
    <div class="login">
        <PopUp 
            class="login__popup" 
            @close-popup="this.$emit('close-popup')" 
            label="Login"
            submitHeadline="Login">
            <template v-slot:form>
                <div class="login__popup__container">
                    <div>
                        <p>Benutzername:</p>
                        <InputText 
                            name="username" 
                            type="text" 
                            placeholder="..." 
                            v-model="username" 
                        />
                    </div>
                    <div>
                        <p>Password:</p>
                        <InputText 
                            name="password" 
                            type="password" 
                            placeholder="..." 
                            v-model="password" 
                        />
                    </div>
                    <p class="login__popup__container__register" @click="$emit('register')">
                        Registrieren
                    </p>
                </div>
            </template>
        </PopUp>
    </div>
</template>

<script>
import PopUp from './PopUp.vue';
import InputText from 'primevue/inputtext';

export default { 
    name: "PopUp-Login",
    data() {
        return {
            username: "",
            password: "",
        }
    },
    components: {
        PopUp,
        InputText
    }
}
</script>

<style lang="scss">
.login__popup {
    height: 100%;
    width: 100%;
    &__container {
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
}
</style>