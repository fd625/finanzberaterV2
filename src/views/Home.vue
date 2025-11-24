<template>
    <div class="home">
        <div v-if="!user" class="login-prompt">
            <h2>Willkommen bei Subvision</h2>
            <p>Bitte melden Sie sich an, um Ihre Finanzen zu verwalten.</p>
            <div class="login-prompt__icon">
                <i class="pi pi-lock" style="font-size: 4rem; color: #ccc;"></i>
            </div>
        </div>
        
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
                    <div class="salary-amount">{{ formatCurrency(userProfile.salary - amountSum) }}</div>
                </div>
            </div>
            
            <contracts-table />

            <popup-add-contract 
                v-if="showPopUp" 
                @close-popup="showPopUp = false"
                @contract-added="addContract">
            </popup-add-contract>
        </div>
    </div>
</template>

<script>
   
import PopupAddContract from '../PopUps/Popup-AddContract.vue';
import { supabase } from '../database.js';
import ContractsTable from '../components/Contracts-Table.vue';

export default {
    name: 'Home',
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            showPopUp: false, 
            userProfile: null,
            amountSum: 0
        }
    },
    components: {
        PopupAddContract,
        ContractsTable
    },
    computed: {
        isAuthenticated() {
            return this.$store.getters['auth/isAuthenticated']
        },
        userProfile() {
            return this.$store.getters['auth/userProfile']
        },
        isLoading() {
            return this.$store.getters['auth/isLoading']
        },
    },
    created() {
        this.$store.dispatch('auth/checkAuthState')
    },
    methods: {
        logout() {
        this.$store.dispatch('auth/logout')
        },
        handleLoginSuccess(user) {
            console.log('Login success handled in header:', user)
            this.showLoginModal = false
            this.$store.dispatch('auth/handleLoginSuccess', user)
        },
    },
}
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

.action-btn {
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 2px;
    
    &.delete-btn {
        background-color: #dc3545;
        color: white;
        
        &:hover {
            background-color: #c82333;
        }
    }
}

.p-datatable-column-header-content,.p-datatable-tbody > tr > td {
 padding: 20px 0 !important;
}
.p-datatable-column-title {
    padding-right: 15px;
}
.p-paginator {
    padding: 15px 0 !important;
}
.p-datatable-paginator-bottom {
    margin-top: 26px;
    border: 1px solid grey !important;
    border-radius: 7px;
}
.p-paginator-page, .p-paginator-next, .p-paginator-last, .p-paginator-first, .p-paginator-prev {
    padding: 10px !important;
}
.p-select-dropdown {
    padding-left: 13px;
}
</style>