<template>
    <div class="calendar-container">
        <!-- Show login prompt if not logged in -->
        <div v-if="!user" class="login-prompt">
            <h2>Kalender</h2>
            <p>Bitte melden Sie sich an, um Ihre Termine zu sehen.</p>
            <div class="login-prompt__icon">
                <i class="pi pi-calendar" style="font-size: 4rem; color: #ccc;"></i>
            </div>
        </div>
        
        <!-- Show calendar if logged in -->
        <div v-else>
            <div class="calendar-header">
                <div class="headline">Kalender</div>
                <button class="add-event-btn" @click="showAddEventModal = true">
                    <i class="pi pi-plus"></i> Termin hinzufügen
                </button>
            </div>
            
            <CalendarView
                :show-date="currentDate"
                display-period-uom="month"
                :display-period-count="1"
                :starting-day-of-week="1"
                :events="userEvents"
                :enable-drag-drop="true"
                :show-event-times="true"
                locale="de-DE"
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
                    <div class="my-event" :class="getEventClass(item.type)">
                        <strong>{{ item.title }}</strong>
                        <div v-if="item.startTime">{{ item.startTime }}</div>
                        <div v-if="item.amount" class="event-amount">{{ formatCurrency(item.amount) }}</div>
                    </div>
                </template>
            </CalendarView>
            
            <!-- Add Event Modal -->
            <div v-if="showAddEventModal" class="modal-overlay" @click="closeAddEventModal">
                <div class="event-modal" @click.stop>
                    <h3>Neuen Termin hinzufügen</h3>
                    <form @submit.prevent="addEvent">
                        <div class="form-group">
                            <label>Titel:</label>
                            <input v-model="newEvent.title" type="text" required />
                        </div>
                        <div class="form-group">
                            <label>Datum:</label>
                            <input v-model="newEvent.date" type="date" required />
                        </div>
                        <div class="form-group">
                            <label>Zeit:</label>
                            <input v-model="newEvent.time" type="time" />
                        </div>
                        <div class="form-group">
                            <label>Typ:</label>
                            <select v-model="newEvent.type">
                                <option value="general">Allgemein</option>
                                <option value="payment">Zahlung</option>
                                <option value="income">Einkommen</option>
                                <option value="meeting">Termin</option>
                            </select>
                        </div>
                        <div class="form-group" v-if="newEvent.type === 'payment' || newEvent.type === 'income'">
                            <label>Betrag (€):</label>
                            <input v-model="newEvent.amount" type="number" step="0.01" />
                        </div>
                        <div class="modal-buttons">
                            <button type="button" @click="closeAddEventModal" class="btn-cancel">
                                Abbrechen
                            </button>
                            <button type="submit" class="btn-submit">
                                Hinzufügen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div style="background: yellow; padding: 10px; margin: 10px;">
    DEBUG: User prop = {{ user ? 'USER EXISTS' : 'NO USER' }}
    <br>
    User ID: {{ user?.id }}
    <br>
    User Email: {{ user?.email }}
</div>
</template>

<script>
import { ref } from 'vue';
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar";
import "../../node_modules/vue-simple-calendar/dist/vue-simple-calendar.css"

export default {
    name: "Calendar",
    props: {
        user: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            showDate: new Date(),
            showAddEventModal: false,
            newEvent: {
                title: '',
                date: '',
                time: '',
                type: 'general',
                amount: null
            },
            userEvents: []
        }
    },
    components: {
        CalendarView,
        CalendarViewHeader,
    },
    setup() {
        const currentDate = ref(new Date());

        function onDateChange(newDate) {
            currentDate.value = newDate;
        }
        
        function onEventClick(item) {
            console.log('Event clicked:', item);
        }

        return { currentDate, onDateChange, onEventClick };
    },
    mounted() {
        // Check auth state when component mounts
        this.checkAuthState();
    },
    watch: {
        user: {
            handler(newUser) {
                console.log('Calendar - User prop changed:', newUser);
                if (newUser) {
                    this.loadUserEvents();
                } else {
                    this.userEvents = [];
                }
            },
            immediate: true
        }
    },
    methods: {
        checkAuthState() {
            // Double-check auth state when component mounts
            console.log('Calendar - Checking auth state, user prop:', this.user);
        },
        
        loadUserEvents() {
            if (!this.user) return;
            
            // Sample user-specific events
            // In a real app, you'd load these from your database
            this.userEvents = [
                { 
                    title: 'Gehalt',
                    start: new Date(2025, 8, 1),
                    end: new Date(2025, 8, 1),
                    startTime: '09:00',
                    type: 'income',
                    amount: 3500
                },
                {
                    title: 'Spotify Abbuchung',
                    start: new Date(2025, 8, 15),
                    end: new Date(2025, 8, 15),
                    startTime: '08:00',
                    type: 'payment',
                    amount: 9.99
                },
                {
                    title: 'Netflix Abbuchung',
                    start: new Date(2025, 8, 20),
                    end: new Date(2025, 8, 20),
                    startTime: '10:00',
                    type: 'payment',
                    amount: 15.99
                },
                {
                    title: 'Arzttermin',
                    start: new Date(2025, 8, 25),
                    end: new Date(2025, 8, 25),
                    startTime: '14:30',
                    type: 'meeting'
                }
            ];
        },
        
        formatCurrency(amount) {
            if (!amount) return '';
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR'
            }).format(amount);
        },
        
        getEventClass(type) {
            switch(type) {
                case 'income':
                    return 'event-income';
                case 'payment':
                    return 'event-payment';
                case 'meeting':
                    return 'event-meeting';
                default:
                    return 'event-general';
            }
        },
        
        closeAddEventModal() {
            this.showAddEventModal = false;
            this.resetNewEvent();
        },
        
        resetNewEvent() {
            this.newEvent = {
                title: '',
                date: '',
                time: '',
                type: 'general',
                amount: null
            };
        },
        
        addEvent() {
            if (!this.newEvent.title || !this.newEvent.date) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }
            
            const eventDate = new Date(this.newEvent.date);
            const newEvent = {
                title: this.newEvent.title,
                start: eventDate,
                end: eventDate,
                startTime: this.newEvent.time || null,
                type: this.newEvent.type,
                amount: this.newEvent.amount ? parseFloat(this.newEvent.amount) : null
            };
            
            this.userEvents.push(newEvent);
            this.closeAddEventModal();
            
            // Here you would normally save to your database
            console.log('New event added:', newEvent);
        }
    }
}
</script>

<style lang="scss">
.calendar-container {
    margin: 35px;
    
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
    
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        
        .headline {
            font-size: 24px;
            font-weight: bold;
        }
        
        .add-event-btn {
            background-color: #417d41;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 7px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            
            &:hover {
                background-color: #356635;
                box-shadow: 0 0 5px grey;
            }
        }
    }
}

.my-calendar-container {
    width: 100%;
    min-height: 400px;
}

.theme-default {
    /* default theme styles are imported; you can override */
}

.my-event {
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    font-size: 0.85em;
    margin: 1px 0;
    
    &.event-general {
        background-color: #87cefa;
    }
    
    &.event-income {
        background-color: #28a745;
    }
    
    &.event-payment {
        background-color: #dc3545;
    }
    
    &.event-meeting {
        background-color: #6f42c1;
    }
    
    .event-amount {
        font-size: 0.8em;
        font-weight: bold;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.event-modal {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    max-width: 90vw;
    
    h3 {
        margin-top: 0;
        margin-bottom: 20px;
        color: #333;
    }
    
    .form-group {
        margin-bottom: 15px;
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        
        input, select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            
            &:focus {
                outline: none;
                border-color: #417d41;
            }
        }
    }
    
    .modal-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            
            &.btn-cancel {
                background-color: #6c757d;
                color: white;
                
                &:hover {
                    background-color: #5a6268;
                }
            }
            
            &.btn-submit {
                background-color: #417d41;
                color: white;
                
                &:hover {
                    background-color: #356635;
                }
            }
        }
    }
}
</style>