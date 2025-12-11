<template>
  <div class="home-table">
    <DataTable 
      v-model:filters="filters" 
      :value="contracts" 
      scrollable 
      scroll-height="1000px" 
      paginator
      :loading="loading"
      :rows="5" 
      :rows-per-page-options="[5, 10, 20, 50]"
      filter-display="menu"
      :global-filter-fields="['company', 'description', 'date', 'amount','scheduled_payment', ]"
    >
      <template #header>
        <div class="flex justify-between home-table__header">
          <Button 
            type="button" 
            icon="pi pi-filter-slash" 
            label="Clear" 
            variant="outlined" 
            @click="clearFilter()" 
          />
          <InputText 
            v-model="filters['global'].value" 
            placeholder="Suche..." 
            style="width: 30% !important; margin: 0 !important;"
          />
        </div>
      </template>
      <template #empty>
        Keine Verträge gefunden.
      </template>
      <template #loading>
        Verträge werden geladen. Bitte warten.
      </template>
                
      <Column 
        field="company" 
        header="Unternehmen"
        style="min-width: 150px" 
        sortable
      />
            
      <Column 
        field="description" 
        header="Beschreibung" 
        style="min-width: 200px" 
        sortable
      >
        <template #body="slotProps">
          {{ slotProps.data.description || '-' }}
        </template>
      </Column>
            
      <Column 
        field="date" 
        header="Startdatum" 
        style="min-width: 120px" 
        sortable
      >
        <template #body="slotProps">
          {{ formatDateToGerman(slotProps.data.start_date)
            + ( slotProps.data.end_date ? " - " + formatDateToGerman(slotProps.data.end_date): " ") }}
        </template>
      </Column>
            
      <Column 
        field="amount" 
        header="Betrag" 
        style="min-width: 120px" 
        sortable
      >
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.amount) }}
        </template>
      </Column>
            
      <Column 
        field="scheduled_payment" 
        header="Abbuchung" 
        style="min-width: 100px" 
        sortable
      >
        <template #body="slotProps">
          {{ slotProps.data.scheduled_payment }}. des Monats
        </template>
      </Column>
            
      <Column
        header="Aktionen"
        style="min-width: 120px"
      >
        <template #body="slotProps">
          <button 
            class="action-btn edit-btn" 
            title="Bearbeiten"
            @click="updateContract(slotProps.data.id)"
          >
            <i class="pi pi-pencil" />
          </button>
          <button 
            class="action-btn delete-btn" 
            title="Löschen"
            @click="deleteContract(slotProps.data.id)"
          >
            <i class="pi pi-trash" />
          </button>
        </template>
      </Column>
    </DataTable>
        
    <PopupFormContract 
      v-if="showUpdateContract" 
      :update-item-id="updateId" 
      @close-popup="showUpdateContract = false"
    />
  </div>
</template>
<script>
import contractManager from "../services/contractManager";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import { FilterMatchMode, FilterOperator } from "@primevue/core/api";
import PopupFormContract from "../PopUps/Popup-FormContract.vue";

export default {
    name: "ContractsTable",
    components: { DataTable, Column, InputText, Button, PopupFormContract },
    data() {
        return {
            contracts: [],
            filters: null,
            loading: false,
            showUpdateContract: false,
            updateId: null
        };
    },
    async created() {
        this.initFilters();
        await this.loadContracts();
    },
    methods: {
        async loadContracts() {
            this.loading = true;
            try {
                this.contracts = await contractManager.getAllContracts();
                this.getSalary();
            } catch (err) {
                console.error("Fehler beim Laden der Verträge:", err);
            } finally {
                this.loading = false;
            }
        },
        getSalary() {
            //TODO: statisics 
            this.$emit("sum", this.contracts.reduce((sum, c) => sum + (c.amount || 0), 0));
        },
        async updateContract(id) {
            this.showUpdateContract = true;
            this.updateId = id;
        }, 
        async deleteContract(id) {
            if (!confirm("Vertrag wirklich löschen?")) {return;}
            try {
                await contractManager.deleteContract(id);
                await this.loadContracts(); 
            } catch (err) {
                console.error("Fehler beim Löschen:", err);
            }
        },

        clearFilter() {
            this.initFilters();
        },

        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                company: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                scheduled_payment: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
            };
        },
        formatCurrency(value) {
            return new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
            }).format(value);
        },
        formatDateToGerman(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}.${month}.${year}`;
        }
    }
};
</script>

<style lang="scss">

.action-btn {
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 2px;
    
    &.edit-btn {
        background-color: green;
        color: white;
        &:hover {
            background-color: rgb(1, 98, 1);
        }
    }
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