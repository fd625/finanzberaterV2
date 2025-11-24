import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import Calendar from '../Views/Calendar.vue'
import Profile from '../Views/Profile.vue'

const routes = [
  { path: '/', component: Home},
  { path: '/Kalendar', component:Calendar },
  { path: '/BenutzerProfil', component: Profile }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router