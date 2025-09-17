<template>
    <div class="calendar-container">
        <div class="headline">Kalendar</div>
		<CalendarView
            :show-date="currentDate"
            display-period-uom="month"
            :display-period-count="1"
            :starting-day-of-week="1"
            :events="myEvents"
            :enable-drag-drop="true"
            :show-event-times="false"
            locale="en-US"
            class="theme-default"
            @item-click="onEventClick"
            @input="onDateChange"
            >
            <template #header="{ headerProps }">
                <CalendarViewHeader
                :header-props="headerProps"
                @input="onDateChange"
                />
            </template>
            
            <template #item="{ item }">
                <div class="my-event">
                <!-- e.g. show title and maybe time: -->
                <strong>{{ item.title }}</strong>
                <div v-if="item.startTime">{{ item.startTime }}</div>
                </div>
            </template>
           
      </CalendarView> 
    </div>
</template>

<script>
import { ref } from 'vue';
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
//import "vue-simple-calendar/dist/css/default.css";   // Basis-Theme
//import "vue-simple-calendar/dist/css/holidays-us.css"
import "../../node_modules/vue-simple-calendar/dist/vue-simple-calendar.css"

export default {
    name: "Calendar",
    data() {
        return {
            showDate: new Date() 
        }
    },
    components: {
        CalendarView,
        CalendarViewHeader,
    },
    setup() {
        const currentDate = ref(new Date());
        const myEvents = ref([
        { 
            title: 'Event A',
            start: new Date(2025, 8, 15),  // month is 0-based
            end: new Date(2025, 8, 16),     // can be multi-day
            startTime: '10:00',
            // other props per docs...
        },
        {
            title: 'Long Event',
            start: new Date(2025, 8, 20),
            end: new Date(2025, 8, 25),
        }
        ]);

        function onDateChange(newDate) {
        currentDate.value = newDate;
        }
        function onEventClick(item) {
        console.log('Event clicked:', item);
        }

        return { currentDate, myEvents, onDateChange, onEventClick };
    }
}
</script>

<style lang="scss">
.calendar-container {
    margin: 35px;
}
.my-calendar-container {
    width: 100%;
    /* ensure container has some height so calendar can display properly */
    min-height: 400px;
  }
  
  .theme-default {
    /* default theme styles are imported; you can override */
  }
  
  .my-event {
    background-color: #87cefa;
    padding: 2px 4px;
    border-radius: 4px;
    color: white;
    font-size: 0.9em;
  }
</style>