import { createRouter, createWebHistory } from "vue-router";
import XiView from "../views/XiView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: XiView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
