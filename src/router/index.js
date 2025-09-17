import { createRouter, createWebHistory } from 'vue-router'
import App from "../App.vue"
import Home from '../views/Home.vue'
import Calendar from '../Views/Calendar.vue'

const routes = [
  { path: '/', component: App},
  { path: '/Calendar', component: App }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router