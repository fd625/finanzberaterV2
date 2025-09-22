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
        :globalFilterFields="['company', 'description', 'date', 'amount']">
        
        <Column 
            field="company" 
            header="Unternehmen"
            style="min-width: 150px" 
            sortable>
        </Column>
        
        <Column 
            field="description" 
            header="Beschreibung" 
            style="min-width: 200px" 
            sortable>
            <template #body="slotProps">
                {{ slotProps.data.description || '-' }}
            </template>
        </Column>
        
        <Column 
            field="date" 
            header="Startdatum" 
            style="min-width: 120px" 
            sortable>
        </Column>
        
        <Column 
            field="amount" 
            header="Betrag" 
            style="min-width: 120px" 
            sortable>
            <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
            </template>
        </Column>
        
        <Column 
            field="scheduled_payment" 
            header="Abbuchung" 
            style="min-width: 100px" 
            sortable>
            <template #body="slotProps">
                {{ slotProps.data.scheduled_payment }}. des Monats
            </template>
        </Column>
        
        <Column header="Aktionen" style="min-width: 120px">
            <template #body="slotProps">
                <button 
                    class="action-btn delete-btn" 
                    @click="deleteContract(slotProps.data.id)"
                    title="Vertrag löschen">
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
import PopupAddContract from '../PopUps/Popup-AddContract.vue';
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
            
            await this.loadContracts();
            
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },
    
    async loadContracts() {
        if (!this.user) return;
        
        try {
            const { data: contracts, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading contracts:', error);
            } else {
                this.contracts = contracts.map(contract => ({
                    ...contract,
                    date: this.formatDisplayDate(contract.start_date),
                    start_date: contract.start_date,
                    end_date: contract.end_date
                }));
            }
            
        } catch (error) {
            console.error('Error loading contracts:', error);
        }
    },
    
    formatDisplayDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },
    
    async addContract(newContract) {
        await this.loadContracts();
    },
    
    async deleteContract(contractId) {
        if (!confirm('Möchten Sie diesen Vertrag wirklich löschen?')) {
            return;
        }
        
        try {
            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', contractId)
                .eq('user_id', this.user.id);
            
            if (error) {
                console.error('Error deleting contract:', error);
                alert('Fehler beim Löschen des Vertrags.');
            } else {
                await this.loadContracts();
            }
            
        } catch (error) {
            console.error('Error deleting contract:', error);
            alert('Fehler beim Löschen des Vertrags.');
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