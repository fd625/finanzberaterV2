<template>
    <div class="popup-add-contract">
       <Popup 
           @close-popup="$emit('close-popup')"
           @submit="addContract"
           label="Vertrag hinzufügen"
           submitHeadline="Hinzufügen">
           
           <template v-slot:form>
               <div class="contract-form">
                   <div v-if="error" class="error-message">
                       {{ error }}
                   </div>
                   
                   <div v-if="loading" class="loading-message">
                       Vertrag wird gespeichert...
                   </div>
                   
                   <div class="form-group">
                       <label>Unternehmen *</label>
                       <InputText 
                           v-model="contract.company"
                           type="text"
                           placeholder="z.B. Spotify, Netflix..."
                           :disabled="loading"
                           required
                       />
                   </div>
                   
                   <div class="form-group">
                       <label>Beschreibung</label>
                       <Textarea 
                           v-model="contract.description"
                           placeholder="Optionale Beschreibung des Vertrags..."
                           :disabled="loading"
                           rows="3"
                       />
                   </div>
                   
                   <div class="form-group">
                       <label>Monatlicher Betrag (€) *</label>
                       <InputNumber
                           v-model="contract.amount"
                           mode="currency"
                           currency="EUR"
                           locale="de-DE"
                           :disabled="loading"
                           :min="0"
                           :maxFractionDigits="2"
                           placeholder="0,00"
                       />
                   </div>
                   
                   <div class="form-row">
                       <div class="form-group">
                           <label>Startdatum *</label>
                           <Calendar
                               v-model="contract.startDate"
                               dateFormat="dd.mm.yy"
                               :disabled="loading"
                               placeholder="Datum auswählen"
                               :showIcon="true"
                           />
                       </div>
                       
                       <div class="form-group">
                           <label>Enddatum</label>
                           <Calendar
                               v-model="contract.endDate"
                               dateFormat="dd.mm.yy"
                               :disabled="loading"
                               placeholder="Optional"
                               :showIcon="true"
                           />
                       </div>
                   </div>
                   
                   <div class="form-group">
                       <label>Abbuchungstag *</label>
                       <Dropdown
                           v-model="contract.scheduledPayment"
                           :options="paymentDays"
                           optionLabel="label"
                           optionValue="value"
                           placeholder="Tag auswählen"
                           :disabled="loading"
                           class="payment-dropdown"
                       />
                   </div>
                   
                   <div class="form-info">
                       <small>* Pflichtfelder</small>
                   </div>
               </div>
           </template>
       </Popup>
    </div>
</template>

<script>
import Popup from './PopUp.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import { supabase } from '../database.js';

export default {
    name: 'Popup-AddContract',
    data() {
        return {
            contract: {
                company: '',
                description: '',
                amount: null,
                startDate: null,
                endDate: null,
                scheduledPayment: 1
            },
            loading: false,
            error: null,
            paymentDays: []
        }
    },
    created() {
        this.paymentDays = Array.from({ length: 31 }, (_, i) => ({
            label: `${i + 1}. des Monats`,
            value: i + 1
        }));
    },
    methods: {
        async addContract() {
            console.log('Adding contract:', this.contract);
            
            this.error = null;
            
            if (!this.contract.company || !this.contract.amount || !this.contract.startDate) {
                this.error = 'Bitte füllen Sie alle Pflichtfelder aus.';
                return;
            }
            
            if (this.contract.amount <= 0) {
                this.error = 'Der Betrag muss größer als 0 sein.';
                return;
            }
            
            if (this.contract.endDate && this.contract.endDate <= this.contract.startDate) {
                this.error = 'Das Enddatum muss nach dem Startdatum liegen.';
                return;
            }
            
            this.loading = true;
            
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                
                if (userError || !user) {
                    throw new Error('Sie müssen angemeldet sein, um einen Vertrag hinzuzufügen.');
                }
                
                const contractData = {
                    user_id: user.id,
                    company: this.contract.company.trim(),
                    description: this.contract.description ? this.contract.description.trim() : null,
                    amount: this.contract.amount,
                    start_date: this.formatDateForDB(this.contract.startDate),
                    end_date: this.contract.endDate ? this.formatDateForDB(this.contract.endDate) : null,
                    scheduled_payment: this.contract.scheduledPayment
                };
                
                console.log('Inserting contract data:', contractData);
                
                const { data, error } = await supabase
                    .from('contracts')
                    .insert([contractData])
                    .select()
                    .single();
                
                if (error) {
                    console.error('Database error:', error);
                    throw error;
                }
                
                console.log('Contract added successfully:', data);
                
                this.$emit('contract-added', data);
                
                this.$emit('close-popup');
                
                this.showSuccessMessage();
                
            } catch (error) {
                console.error('Error adding contract:', error);
                this.error = this.getErrorMessage(error);
            } finally {
                this.loading = false;
            }
        },
        
        formatDateForDB(date) {
            if (!date) return null;
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },
        
        getErrorMessage(error) {
            if (error.message) {
                if (error.message.includes('unique constraint')) {
                    return 'Ein ähnlicher Vertrag existiert bereits.';
                } else if (error.message.includes('foreign key')) {
                    return 'Benutzer-Authentifizierung fehlgeschlagen.';
                } else if (error.message.includes('check constraint')) {
                    return 'Ungültige Eingabedaten. Bitte überprüfen Sie Ihre Eingaben.';
                }
                return error.message;
            }
            return 'Ein unbekannter Fehler ist aufgetreten.';
        },
        
        showSuccessMessage() {
            console.log('Contract added successfully!');
        },
        
        resetForm() {
            this.contract = {
                company: '',
                description: '',
                amount: null,
                startDate: null,
                endDate: null,
                scheduledPayment: 1
            };
            this.error = null;
        }
    },
    components: {
        Popup,
        InputText,
        InputNumber,
        Textarea,
        Calendar,
        Dropdown
    }
}
</script>

<style lang="scss">
.contract-form {
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
    
    .form-group {
        margin-bottom: 15px;
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
            font-size: 14px;
        }
    }
    
    .form-row {
        display: flex;
        gap: 15px;
        
        .form-group {
            flex: 1;
        }
    }
    
    .form-info {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        
        small {
            color: #666;
            font-style: italic;
        }
    }
}

// PrimeVue component styling
.p-inputtext, 
.p-inputnumber-input,
.p-calendar input,
.p-dropdown {
    width: 100% !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 8px !important;
    
    &:focus {
        border-color: #417d41 !important;
        box-shadow: 0 0 0 0.1rem rgba(65, 125, 65, 0.25) !important;
    }
    
    &:disabled {
        background-color: #f5f5f5 !important;
        cursor: not-allowed !important;
    }
}

.p-textarea {
    width: 100% !important;
    border: 1px solid #ddd !important;
    border-radius: 4px !important;
    padding: 8px !important;
    font-family: inherit !important;
    resize: vertical !important;
    
    &:focus {
        border-color: #417d41 !important;
        box-shadow: 0 0 0 0.1rem rgba(65, 125, 65, 0.25) !important;
    }
    
    &:disabled {
        background-color: #f5f5f5 !important;
        cursor: not-allowed !important;
    }
}

.p-calendar {
    .p-button {
        background-color: #417d41 !important;
        border-color: #417d41 !important;
        
        &:hover {
            background-color: #356635 !important;
            border-color: #356635 !important;
        }
    }
}

.payment-dropdown {
    .p-dropdown-label {
        padding: 8px !important;
    }
}

.p-inputnumber {
    .p-inputnumber-buttons {
        .p-button {
            background-color: #417d41 !important;
            border-color: #417d41 !important;
            
            &:hover {
                background-color: #356635 !important;
                border-color: #356635 !important;
            }
        }
    }
}
</style>