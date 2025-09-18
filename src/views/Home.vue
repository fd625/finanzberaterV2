<template>
    <div class="home">
        <div class="home__header">
            <div class="headline">Finanzen</div>
            <button class="home__header__button" @click="showPopUp = true">Hinzufügen</button>
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
                header="Company" 
                footer="Company" 
                style="min-width: 200px" 
                sortable >
            </Column>
            <Column 
                field="date" 
                header="Date" 
                footer="Date" 
                style="min-width: 200px" 
                sortable >
            </Column>
            <Column 
                field="balance" 
                header="Balance" 
                footer="Balance" 
                style="min-width: 200px" 
                sortable >
            </Column>
        </DataTable>
        </div>

        <popup-add-contract 
            v-if="showPopUp" 
            @close-popup="showPopUp = false"></popup-add-contract>
    </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';      
import PopupAddContract from '../components/Popup-AddContract.vue';

export default {
    name: 'Home',
    data() {
        return {
            showPopUp: false, 
            contracts: [
            {
                company: "Spotify",
                date: "01.102.1202",
                balance: "102"
            },
            {
                company: "Netflix",
                date: "01.102.1202",
                balance: "102"
            },
        ]
        }
    },
    components: {
        DataTable,
        Column,
        ColumnGroup,
        Row,
        PopupAddContract
    }
}
</script>

<style lang="scss">
.home {
    margin: 36px;
    &__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        &__button {
             border-radius: 7px;
             background-color: #417d41;
            color: white;
            border: none;
            &:hover {
                cursor: pointer;
                box-shadow: 0 0 5px grey;
            }
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
