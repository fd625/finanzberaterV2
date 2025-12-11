import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Views/Home.vue'
import Calendar from '../Views/Calendar.vue'
import Profile from '../Views/Profile.vue'
import Statistics from '../views/Statistics.vue'

const routes = [
  { path: '/', component: Home},
  { path: '/Kalendar', component:Calendar },
  { path: '/BenutzerProfil', component: Profile },
  { path: '/Statistiken', component: Statistics}

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router