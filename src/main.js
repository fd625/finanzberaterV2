import { createApp } from 'vue'
import './styles/style.css'
import './styles/responsiveness.scss'
import App from './App.vue'
import router from './router'
import "primeicons/primeicons.css"
// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import store from "./store/index";

const app = createApp(App)

app.use(store)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

app.mount('#app')

