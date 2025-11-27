<template>
    <div class="home-table">
        <DataTable 
            :value="contracts" 
            scrollable 
            scrollHeight="400px" 
            paginator 
            :loading="loading"
            v-model:filters="filters"
            :rows="5" 
            :rowsPerPageOptions="[5, 10, 20, 50]"
            filterDisplay="menu"
            :globalFilterFields="['company', 'description', 'date', 'amount','scheduled_payment', ]">
            
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
            <template #empty> Keine Verträge gefunden. </template>
            <template #loading> Verträge werden geladen. Bitte warten. </template>
                
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
</template>
<script>
import contractManager from "../services/contractManager";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

export default {
    name: "contracts-table",
    components: { DataTable, Column, InputText, Button },
    data() {
        return {
            contracts: [],
            filters: null,
            loading: false
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
            } catch (err) {
                console.error("Fehler beim Laden der Verträge:", err);
            } finally {
                this.loading = false;
            }
        },

        async deleteContract(id) {
            if (!confirm("Vertrag wirklich löschen?")) return;
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
        }
    }
};
</script>