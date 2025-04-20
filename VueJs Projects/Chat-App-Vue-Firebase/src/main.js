/* eslint-disable */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeNotifications } from "@/utils/notifications";
import ToastNotification from "./components/ToastNotification.vue";
import "./assets/styles.css";

const app = createApp(App);

// Mount ToastNotification globally and expose $toast
const toastInstance = createApp(ToastNotification).mount(
  document.createElement("div")
);
document.body.appendChild(toastInstance.$el);
window.$toast = toastInstance;

// Initialize Firebase auth state listener
const auth = getAuth();
let appMounted = false;

onAuthStateChanged(auth, async (user) => {
  store.commit(
    "SET_USER",
    user
      ? {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      : null
  );

  if (user) {
    try {
      // Initialize notifications
      await initializeNotifications();
    } catch (error) {
      console.error("Notification setup error:", error);
    }
  }

  if (!appMounted) {
    app.use(router).use(store).mount("#app");
    appMounted = true;
  }
});

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered:", registration);
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed:", err);
      });
  });
}
