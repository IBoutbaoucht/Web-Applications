import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
import AddJob from "../views/AddJob.vue";
import JobDetail from "../views/JobDetail.vue";
import EditJob from "../views/EditJob.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/add",
    name: "AddJob",
    component: AddJob,
  },
  {
    path: "/jobs/:id",
    name: "JobDetail",
    component: JobDetail,
  },
  {
    path: "/jobs/:id/edit",
    name: "EditJob",
    component: EditJob,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
