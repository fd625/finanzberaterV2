<template>
  <div class="popup-add-contract">
    <Popup 
      label="Vertrag"
      submit-headline="Speichern"
      @close-popup="$emit('close-popup')"
      @submit="submitContract"
    >
      <template #form>
        <div class="contract-form">
          <div
            v-if="error"
            class="error-message"
          >
            {{ error }}
          </div>
                   
          <div
            v-if="loading"
            class="loading-message"
          >
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
            <PTextarea 
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
              :max-fraction-digits="2"
              placeholder="0,00"
            />
          </div>
                   
          <div class="form-row">
            <div class="form-group">
              <label>Startdatum *</label>
              <DatePicker
                v-model="contract.start_date"
                :disabled="loading"
                placeholder="Datum auswählen"
                :show-icon="true"
              />
            </div>
                       
            <div class="form-group">
              <label>Enddatum</label>
              <DatePicker
                v-model="contract.end_date"
                :disabled="loading"
                placeholder="Optional"
                :show-icon="true"
              />
            </div>
          </div>
                   
          <div class="form-group">
            <label>Abbuchungstag *</label>
            <Dropdown
              v-model="contract.scheduledPayment"
              :options="paymentDays"
              option-label="label"
              option-value="value"
              placeholder="Tag auswählen"
              :disabled="loading"
              class="payment-dropdown"
              append-to="body"
            />
          </div>
                 
          <div class="form-group --m-b-20">
            <label>Relevanz</label>
            <Slider
              v-model="contract.importance"
              class="w-56"
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
import Popup from "./PopUp.vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import PTextarea from "primevue/textarea"; // Rename import
import DatePicker from "primevue/datepicker";
import Dropdown from "primevue/dropdown";
import { supabase } from "../database.js";
import contractManager from "../services/contractManager.js";
import Slider from "primevue/slider";

export default {
    name: "PopupFormContract",
    components: {
        Popup,
        InputText,
        InputNumber,
        PTextarea,
        DatePicker,
        Dropdown,
        Slider
    }, // Add emits
    props: {
        updateItemId: {
            type: String,
            default: null
        }
    },
    emits: ["close-popup", "contract-added", "contract-updated"],
    data() {
        return {
            contract: {
                company: "",
                description: "",
                amount: null,
                start_date: null,
                end_date: null,
                scheduledPayment: 1,
                importance: 50
            },
            loading: false,
            error: null,
            paymentDays: []
        };
    },
    created() {
        this.paymentDays = Array.from({ length: 31 }, (_, i) => ({
            label: `${i + 1}. des Monats`,
            value: i + 1
        }));
        if (this.updateItemId !== null) { // Changed != to !==
            this.loadContract();
        }
    },
    methods: {
        formatDateToGerman(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        },
        async loadContract() {
            this.loading = true;
            try {
                this.contract = await contractManager.getContractById(this.updateItemId);
                this.contract.start_date = new Date(this.contract.start_date);
            } catch (error) {
                console.error("Error loading contract:", error);
                this.error = "Vertrag konnte nicht geladen werden.";
            } finally {
                this.loading = false;
            }
        },
        async submitContract() {
            this.error = null;

            if (!this.contract.company || !this.contract.amount || !this.contract.start_date) {
                this.error = "Bitte füllen Sie alle Pflichtfelder aus.";
                return;
            }

            if (this.contract.amount <= 0) {
                this.error = "Der Betrag muss größer als 0 sein.";
                return;
            }

            if (this.contract.end_date && this.contract.end_date <= this.contract.start_date) {
                this.error = "Das Enddatum muss nach dem Startdatum liegen.";
                return;
            }

            this.loading = true;

            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error("Sie müssen angemeldet sein, um einen Vertrag zu speichern.");
                }

                const contractData = {
                    company: this.contract.company,
                    amount: this.contract.amount,
                    start_date: this.contract.start_date,
                    end_date: this.contract.end_Date,
                    user_id: user.id,
                    importance: this.contract.importance,
                    scheduled_payment: this.contract.scheduledPayment
                };

                let savedContract = null;

                if (this.updateItemId !== null) { // Changed != to !==
                    savedContract = await contractManager.updateContract(
                        this.updateItemId,
                        contractData
                    );
                    this.$emit("contract-updated", savedContract);
                } else {
                    savedContract = await contractManager.createContract(contractData);
                    this.$emit("contract-added", savedContract);
                }

                this.$emit("close-popup");
                this.showSuccessMessage();

            } catch (error) {
                console.error("Error saving contract:", error);
                this.error = this.getErrorMessage(error);
            } finally {
                this.loading = false;
            }
        },
        
        showSuccessMessage() {
            // Success handling
        },
        
        getErrorMessage(error) {
            return error.message || "Ein Fehler ist aufgetreten";
        },
        
        resetForm() {
            this.contract = {
                company: "",
                description: "",
                amount: null,
                start_date: null,
                end_date: null,
                scheduledPayment: 1,
                importance: 50
            };
            this.error = null;
        }
    }
};
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

.p-datepicker,
.p-datepicker-panel {
    z-index: 10000 !important;
}
</style>