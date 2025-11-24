<template>
  <div class="header">
    <img class="header__logo" :src="logoPng" alt="logo" />
    <div class="header__container">
      <div class="header__navigation">
        <RouterLink to="/Finanzen" class="header__navigation__item">Finanzen</RouterLink>
        <RouterLink to="/Kalendar" class="header__navigation__item">Kalendar</RouterLink>
        <RouterLink to="/BenutzerProfil" class="header__navigation__item">Profil</RouterLink>
      </div>

      <div class="header__user-section">
        <div v-if="isAuthenticated" class="header__user-info">
          <span class="header__username">{{ userProfile?.username || user?.email }}</span>
          <button class="header__logout-btn" @click="logout">Abmelden</button>
        </div>
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
import PopUpLogin from "../PopUps/PopUp-Login.vue";
import PopUpRegister from "../PopUps/PopUp-Register.vue";
import { RouterLink } from "vue-router";

export default {
  name: "HeaderNav",
  components: { PopUpLogin, PopUpRegister, RouterLink },

  data() {
    return {
      logoPng: logo,
      showLoginModal: false,
      showRegisterModal: false
    }
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    userProfile() {
      return this.$store.getters['auth/userProfile']
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    }
  },

  mounted() {
    // Auth-State beim Laden prüfen
    this.$store.dispatch('auth/checkAuthState')

    // Auth-State Listener
    const authApi = this.$store._modulesNamespaceMap['auth/']?.context?.state // Optional, nur um sicherzustellen
    import('../API/resources/auth.js').then(({ default: authApi }) => {
      authApi.supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session)
        await this.$store.dispatch('auth/checkAuthState')
      })
    })
  },

  methods: {
    register() {
      this.showLoginModal = false
      this.showRegisterModal = true
    },
    handleLoginSuccess(user) {
      this.showLoginModal = false
      this.$store.dispatch('auth/handleLoginSuccess', user)
    },
    logout() {
      this.$store.dispatch('auth/logout')
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