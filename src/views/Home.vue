<template>
    <div class="home">
        <!-- Show login prompt if not logged in -->
        <div v-if="!user" class="login-prompt">
            <h2>Willkommen bei Finanzen Manager</h2>
            <p>Bitte melden Sie sich an, um Ihre Finanzen zu verwalten.</p>
            <div class="login-prompt__icon">
                <i class="pi pi-lock" style="font-size: 4rem; color: #ccc;"></i>
            </div>
        </div>
        
        <!-- Show content if logged in -->
        <div v-else>
            <div class="home__header">
                <div class="headline">
                    Finanzen 
                    <span v-if="userProfile" class="welcome-text">- Willkommen {{ userProfile.username }}!</span>
                </div>
                <button class="home__header__button" @click="showPopUp = true">Hinzufügen</button>
            </div>
            
            <!-- Show user's salary info if available -->
            <div v-if="userProfile && userProfile.salary" class="salary-info">
                <div class="salary-card">
                    <h3>Ihr monatliches Gehalt</h3>
                    <div class="salary-amount">{{ formatCurrency(userProfile.salary) }}</div>
                </div>
            </div>
            
            <div class="home-table">
                <DataTable 
                    :value="contracts" 
                    scrollable 
                    scrollHeight="400px" 
                    paginator 
                    :rows="5" 
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    filterDisplay="menu"
                    :globalFilterFields="['company', 'date', 'balance']">
                    <Column 
                        field="company" 
                        header="Unternehmen" 
                        footer="Unternehmen" 
                        style="min-width: 200px" 
                        sortable>
                    </Column>
                    <Column 
                        field="date" 
                        header="Datum" 
                        footer="Datum" 
                        style="min-width: 200px" 
                        sortable>
                    </Column>
                    <Column 
                        field="balance" 
                        header="Betrag" 
                        footer="Betrag" 
                        style="min-width: 200px" 
                        sortable>
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.balance) }}
                        </template>
                    </Column>
                    <Column header="Aktionen" style="min-width: 120px">
                        <template #body="slotProps">
                            <button 
                                class="action-btn delete-btn" 
                                @click="deleteContract(slotProps.index)">
                                <i class="pi pi-trash"></i>
                            </button>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <popup-add-contract 
                v-if="showPopUp" 
                @close-popup="showPopUp = false"
                @contract-added="addContract">
            </popup-add-contract>
        </div>
    </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';      
import PopupAddContract from '../components/Popup-AddContract.vue';
import { supabase } from '../database.js';

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
            contracts: [],
            userProfile: null
        }
    },
    components: {
        DataTable,
        Column,
        ColumnGroup,
        Row,
        PopupAddContract
    },
    watch: {
        user: {
            handler(newUser) {
                if (newUser) {
                    this.loadUserData();
                } else {
                    this.contracts = [];
                    this.userProfile = null;
                }
            },
            immediate: true
        }
    },
    methods: {
        async loadUserData() {
            if (!this.user) return;
            
            try {
                // Load user profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', this.user.id)
                    .single();
                
                if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error loading user profile:', profileError);
                } else if (profile) {
                    this.userProfile = profile;
                }
                
                // Load user contracts (you'll need to create this table)
                // For now, we'll use sample data
                this.contracts = [
                    {
                        company: "Spotify",
                        date: "01.10.2024",
                        balance: 9.99
                    },
                    {
                        company: "Netflix",
                        date: "15.10.2024",
                        balance: 15.99
                    },
                ];
                
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount);
        },
        addContract(newContract) {
            this.contracts.push(newContract);
        },
        deleteContract(index) {
            if (confirm('Möchten Sie diesen Vertrag wirklich löschen?')) {
                this.contracts.splice(index, 1);
            }
        }
    }
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
        margin-bottom: 30px;
        
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

// Keep existing PrimeVue styles
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