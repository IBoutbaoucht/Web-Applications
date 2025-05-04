import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";

// Route components
import Login from "@/views/LoginView.vue";
import Dashboard from "@/views/DashboardView.vue";
import SkillTracker from "@/views/SkillTracker.vue";
import Projects from "@/views/ProjectsView.vue";
import Timeline from "@/views/TimelineView.vue";
import Objectives from "@/views/ObjectivesView.vue";
import ProjectDetail from "@/views/ProjectDetailView.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/skills",
    name: "Skills",
    component: SkillTracker,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    meta: { requiresAuth: true },
  },
  {
    path: "/projects/:id",
    name: "ProjectDetail",
    component: ProjectDetail,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/timeline",
    name: "Timeline",
    component: Timeline,
    meta: { requiresAuth: true },
  },
  {
    path: "/objectives",
    name: "Objectives",
    component: Objectives,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  // Catch-all route for 404
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (to.path === "/login" && currentUser) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
