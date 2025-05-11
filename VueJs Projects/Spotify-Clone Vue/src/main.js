import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/tailwind.css"; // Adjust path if needed

createApp(App).use(router).mount("#app");
