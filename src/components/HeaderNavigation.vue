<template>
    <div class="header">
        <img class="header__logo" :src="logoPng" alt="logo" />
        <div class="header__container">
            <div class="header__navigation">
                <div class="header__navigation__item" @click="navigate('Home')">Finanzen</div>
                <div class="header__navigation__item" @click="navigate('Calendar')">Kalendar</div>
            </div>
            <div class="header__user-section">
                <!-- Show user info if logged in -->
                <div v-if="user" class="header__user-info">
                    <span class="header__username">{{ userProfile?.username || user.email }}</span>
                    <button class="header__logout-btn" @click="logout">Abmelden</button>
                </div>
                <!-- Show login button if not logged in -->
                <div v-else class="header__user-button">
                    <i class="header__user-button__icon pi pi-user" @click="showLoginModal = true"></i>
                </div>
            </div>
        </div>

        <pop-up-login 
            @close-popup="showLoginModal = false" 
            @login-success="handleLoginSuccess"
            v-if="showLoginModal"
            @register="register()">
        </pop-up-login>

        <pop-up-register 
            v-if="showRegisterModal" 
            @close-popup="showRegisterModal = false">
        </pop-up-register>
    </div>
</template>

<script>
import logo from "../assets/logo.png";
import 'primeicons/primeicons.css'
import PopUpLogin from "./PopUp-Login.vue";
import PopUpRegister from "./PopUp-Register.vue";
import { supabase } from '../database.js';

export default {
    name: "HeaderNav",
    data() {
        return {
            logoPng: logo,
            showLoginModal: false,
            showRegisterModal: false,
            user: null,
            userProfile: null
        }
    },
    components: {
        PopUpLogin,
        PopUpRegister
    },
    async mounted() {
        // Check if user is already logged in
        await this.checkAuthState();
        
        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session);
            
            if (event === 'SIGNED_IN' && session) {
                this.user = session.user;
                await this.loadUserProfile();
                this.$emit('user-changed', this.user);
            } else if (event === 'SIGNED_OUT') {
                this.user = null;
                this.userProfile = null;
                this.$emit('user-changed', null);
            }
        });
    },
    methods: {
        navigate(to) {
            this.$emit('navigate', to);
        },
        register() {
            this.showLoginModal = false;
            this.showRegisterModal = true;
        },
        async checkAuthState() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                console.log('Header - Current session:', session);
                if (session) {
                    this.user = session.user;
                    await this.loadUserProfile();
                    this.$emit('user-changed', this.user);
                } else {
                    console.log('Header - No session found');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
            }
        },
        async loadUserProfile() {
            if (!this.user) return;
            
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', this.user.id)
                    .single();
                
                if (error && error.code !== 'PGRST116') {
                    console.error('Error loading user profile:', error);
                } else if (data) {
                    this.userProfile = data;
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        },
        handleLoginSuccess(user) {
            console.log('Login success handled in header:', user);
            this.showLoginModal = false;
        },
        async logout() {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                
                console.log('User logged out');
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
    }
}
</script>

<style lang="scss">
    .header {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        
        &__navigation {
            display: flex;
            flex-direction: row;
            &__item {
                margin: 0 20px; 
                color: black;
                text-decoration: none;
                &:hover {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
        }
        
        &__user-section {
            display: flex;
            align-items: center;
        }
        
        &__user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-right: 40px;
        }
        
        &__username {
            font-weight: bold;
            color: #333;
        }
        
        &__logout-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            
            &:hover {
                background-color: #c82333;
                box-shadow: 0 0 5px gray;
            }
        }
        
        &__user-button {
            &__icon {
                margin-right: 40px;
                padding: 5px;
                border: 1px solid;
                border-radius: 50%;
                &:hover {
                    cursor: pointer;
                    box-shadow: 0 0 5px gray;
                }
            }
        }
        
        &__container {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        
        &__logo {
            height: 100px;
            width: 180px;
            object-fit: contain;
        }
    }
</style>