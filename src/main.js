import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(PrimeVue, { unstyled: false }) // unstyled true = keine Standardstyles
app.mount('#app')

