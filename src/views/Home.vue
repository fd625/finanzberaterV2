<template>
  <div class="home">
    <authMessageBox v-if="!isAuthenticated" />

    <div v-else>
      <div class="home__header">
        <div class="headline">
          Finanzen
          <span v-if="userProfile" class="welcome-text">- Willkommen {{ userProfile.username }}!</span>
        </div>
        <button class="home__header__button" @click="showPopUp = true">Hinzufügen</button>
      </div>

      <div v-if="userProfile && userProfile.salary" class="salary-info">
        <div class="salary-card">
          <h3>Ihr monatliches Restgehalt</h3>
          <div class="salary-amount">{{ remainingSalary }}</div>
        </div>
      </div>

      <contracts-table ref="table" @sum="x => amountSum = x" />

      <PopupFormContract
        v-if="showPopUp"
        @close-popup="closePopUp()"
      />
    </div>
  </div>
</template>

<script>
import PopupFormContract from '../PopUps/Popup-FormContract.vue';
import ContractsTable from '../components/Contracts-Table.vue';
import { mapState, mapGetters, mapActions } from 'vuex';
import authMessageBox from '../components/auth-message-box.vue';

export default {
  name: 'Home',
  components: { ContractsTable, PopupFormContract,authMessageBox },
  data() {
    return {
      showPopUp: false,
      amountSum: 0,

    };
  },
  computed: {
    ...mapState('currentUser', ['user', 'profile']),
    ...mapGetters('currentUser', ['isAuthenticated']),
    remainingSalary() {
        return this.formatCurrency(this.$store.getters["currentUser/remainingSalary"]);
    },
    userProfile() {
      return this.profile;
    }
  },
  created() {
    this.checkAuthState();
  },
  methods: {
    ...mapActions('currentUser', ['checkAuthState', 'logout']),
    closePopUp() {
        this.showPopUp = false;
        this.$refs.table.loadContracts();
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
  }
};
</script>

<style lang="scss">
.home {
    margin: 36px;
    
    .login-prompt {
        text-align: center;
        padding: 60px 20px;
        
        h2 {
            color: #333;
            margin-bottom: 20px;
        }
        
        p {
            color: #666;
            font-size: 16px;
            margin-bottom: 40px;
        }
        
        &__icon {
            margin-top: 20px;
        }
    }
    &-table {
        &__header {
            flex-direction: row;
            display: flex;
            justify-content: space-between;
        }
    }
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        
        .headline {
            font-size: 24px;
            font-weight: bold;
            
            .welcome-text {
                font-size: 16px;
                color: #666;
                font-weight: normal;
            }
        }
        
        &__button {
            border-radius: 7px;
            background-color: #417d41;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            
            &:hover {
                cursor: pointer;
                box-shadow: 0 0 5px grey;
                background-color: #356635;
            }
        }
    }
    
    .salary-info {
        
        .salary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            
            h3 {
                margin: 0 0 10px 0;
                font-size: 16px;
                opacity: 0.9;
            }
            
            .salary-amount {
                font-size: 28px;
                font-weight: bold;
            }
        }
    }
}
</style>