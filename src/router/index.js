import { createRouter, createWebHistory } from "vue-router";
import Home from "../Views/Home.vue";
import Profile from "../Views/Profile.vue";
import Statistics from "../views/Statistics.vue";
import DataProtection from "../views/DataProtection.vue";
import FAQ from "../views/FAQ.vue";
import Impressum from "../views/Impressum.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/BenutzerProfil", component: Profile },
    { path: "/Statistiken", component: Statistics },
    { path: "/DatenSchutz", component: DataProtection },
    { path: "/FAQ", component: FAQ },
    { path: "/Impressum", component: Impressum }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;