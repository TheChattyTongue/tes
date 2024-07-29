import { createRouter, createWebHistory } from "vue-router";
import Accordion from "../components/Accordion.vue";
import Detailes from "../components/Detailes.vue";

const routes = [
  {
    path: "/",
    name: "Accordion",
    component: Accordion,
  },
  {
    path: "/detail/:id",
    name: "Detailes",
    component: Detailes,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
