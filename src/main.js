import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
//app.use(router)

app.mount('#app')

