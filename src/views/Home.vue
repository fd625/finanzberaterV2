<template>
    <div class="home">
        <div class="home__header">
            <div class="headline">Finanzen</div>
            <button class="home__header__button" @click="showPopUp = true">Hinzufügen</button>
        </div>
        <div class="home-table">
            
        <DataTable :value="contracts" scrollable scrollHeight="400px">
            <Column field="company" header="Company" footer="Company" style="min-width: 200px"></Column>
            <Column field="date" header="Date" footer="Date" style="min-width: 200px"></Column>
            <Column field="balance" header="Balance" footer="Balance" style="min-width: 200px"></Column>
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
</style>
