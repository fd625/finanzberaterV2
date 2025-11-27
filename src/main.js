import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
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

