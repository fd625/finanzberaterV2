<template>
  <div class="header">
    <img class="header__logo" :src="logoPng" alt="logo" />
    <div class="header__container">
      <div class="header__navigation">
        <RouterLink to="/" class="header__navigation__item">Finanzen</RouterLink>
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
      v-if="showLoginModal"
      @close-popup="showLoginModal = false"
      @login-success="handleLoginSuccess"
      @register="register"
    ></pop-up-login>

    <pop-up-register 
      v-if="showRegisterModal" 
      @close-popup="showRegisterModal = false"
    ></pop-up-register>
  </div>
</template>

<script>
import logo from "../assets/logo.png";
import 'primeicons/primeicons.css';
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
      showRegisterModal: false,
    }
  },

  computed: {
    user() {
      return this.$store.state.currentUser.user;
    },
    userProfile() {
      return this.$store.state.currentUser.profile;
    },
    isAuthenticated() {
      return this.$store.getters['currentUser/isAuthenticated'];
    },
    isLoading() {
      return this.$store.getters['currentUser/isLoading'];
    }
  },

  created() {
    // Prüfe Auth-Status beim Laden
    this.$store.dispatch('currentUser/checkAuthState');
  },

  methods: {
    register() {
      this.showLoginModal = false;
      this.showRegisterModal = true;
    },

    handleLoginSuccess(user) {
      this.showLoginModal = false;
      // Dispatch login Erfolg an den Store
      this.$store.dispatch('currentUser/handleLoginSuccess', user);
    },

    logout() {
      this.$store.dispatch('currentUser/logout');
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