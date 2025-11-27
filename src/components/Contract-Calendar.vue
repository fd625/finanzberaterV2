<template>
  <div class="calendar-wrapper">
    <CalendarView
      :show-date="currentDate"
      class="theme-default"
      :events="events"
      :items="events"
      @click-item="x => onEventClick(x)"
    >
        <template #header="{ headerProps }">
            <CalendarViewHeader
                :header-props="headerProps"
                @input="onDateChange"
            />
        </template>

        <!-- <template #item="{ item }">
          <div class="my-event" :class="getEventClass(item.type)">
            <strong>{{ item. }}</strong>
          </div>
        </template> -->
      </CalendarView>
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "vue-simple-calendar/dist/vue-simple-calendar.css";
import { contractManager } from "../services/contractManager.js";

export default {
  name: "CalendarWithContracts",
  components: {
    CalendarView,
    CalendarViewHeader
  },
  data() {
    return {
      currentDate: new Date(),
      events: [],
    };
  },
  methods: {
    async loadContracts() {
      try {
        const contracts = await contractManager.getAllContracts();

        // Contracts in Calendar-Events umwandeln
        this.events = contracts.map(contract => ({
          id: contract.id,  
          title: contract.company,
          startDate: new Date(contract.start_date),
          endDate: contract.end_date ? new Date(contract.end_date) : new Date(contract.start_date),
        }));
      } catch (error) {
        console.error("Fehler beim Laden der Contracts:", error);
        this.events = [];
      }
    },
    onEventClick(item) {
      console.log("Event clicked:", item);
    },
    getEventClass(type) {
        switch(type) {
        case "income": return "event-income";
        case "payment": return "event-payment";
        case "meeting": return "event-meeting";
        default: return "event-general";
        }
    },
    formatCurrency(amount) {
        if (!amount) return "";
        return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
    },
    onDateChange(newDate) {
        this.currentDate = newDate;
    }
  },
  mounted() {
    this.loadContracts();
  },
};
</script>

<style lang="scss">
.calendar-wrapper {
  height: 500px;
}
.cv-item {
    background-color: rgb(170, 0, 85) !important;
    border-radius: 2px;
    color: white !important;
    &:hover {
        cursor: pointer;
        box-shadow: 0 0 3px rgb(157, 157, 157);
    }
}
</style>
