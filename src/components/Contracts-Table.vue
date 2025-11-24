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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row'; 
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
    name: "contracts-table",
    data() {
        return {
            contracts: [],
            filters: null,
        }
    },
    components: {
        DataTable,
        Column,
        ColumnGroup,
        Row,
        IconField,
        InputIcon,
        InputText,
        Button
    },
    created() {
        this.initFilters();
    },
    computed: {
        contracts() {
            return this.$store.getters['contract/contracts']
        },
        amountSum() {
            return this.$store.getters['contract/amountSum']
        },
        isLoading() {
            return this.$store.getters['contract/isLoading']
        },
    },
    created() {
        this.$store.dispatch('contract/loadContracts')
    },
    methods: {
        deleteContract(id) {
            this.$store.dispatch('contract/deleteContract', id)
        },
        clearFilter() {
            this.initFilters();
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },

                company: { 
                    operator: FilterOperator.AND, 
                    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] 
                },

                description: { 
                    operator: FilterOperator.AND, 
                    constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] 
                },

                date: { 
                    operator: FilterOperator.AND, 
                    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] 
                },

                amount: { 
                    operator: FilterOperator.AND, 
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
                },

                scheduled_payment: { 
                    operator: FilterOperator.AND, 
                    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] 
                }
            };
        }
    }
}
</script>
<style lang="scss">
    
</style>