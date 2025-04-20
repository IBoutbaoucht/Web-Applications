import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";
import { showToast } from "@/utils/toast";

const routes = [
  {
    path: "/",
    name: "ChatRoom",
    component: () => import("../views/ChatRoom.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: { guest: true },
  },
  {
    path: "/chat/:chatId",
    name: "PrivateChat",
    component: () => import("../views/PrivateChat.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/group/:groupId",
    name: "GroupChat",
    component: () => import("../views/GroupChat.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || ""),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isGuest = to.matched.some((record) => record.meta.guest);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    showToast("Please login to continue", "error");
    next("/login");
  } else if (isGuest && currentUser) {
    next("/");
  } else {
    next();
  }
});

export default router;
