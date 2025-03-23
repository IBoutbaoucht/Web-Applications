import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CreatePostView from "@/views/CreatePostView.vue";
import PostDetailView from "@/views/PostDetailView.vue";
import EditPostView from "@/views/EditPostView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "CreatePost",
    component: CreatePostView,
  },
  {
    path: "/post/:id",
    name: "PostDetail",
    component: PostDetailView,
  },
  {
    path: "/post/:id/edit",
    name: "EditPost",
    component: EditPostView,
  },
  {
    path: "/tags/:tag",
    name: "TagPosts",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
