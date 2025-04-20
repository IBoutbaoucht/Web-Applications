/* eslint-disable */
<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200"
  >
    <header
      v-if="isAuthenticated"
      class="bg-white dark:bg-gray-800 shadow-md px-4 py-2 flex justify-between items-center"
    >
      <router-link
        to="/"
        class="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        ChatApp
      </router-link>
      <div class="flex items-center space-x-4">
        <NotificationCenter />
        <button
          @click="toggleDarkMode"
          class="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
        >
          <svg
            v-if="darkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
        <button
          @click="logout"
          class="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
  <ToastNotification />
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import NotificationCenter from "@/components/NotificationCenter.vue";
import ToastNotification from "@/components/ToastNotification.vue";

export default {
  components: {
    NotificationCenter,
    ToastNotification,
  },
  setup() {
    const router = useRouter();
    const darkMode = ref(false);
    const currentUser = ref(null);

    const isAuthenticated = computed(() => !!currentUser.value);

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem("darkMode", darkMode.value.toString());
      updateTheme();
    };

    const updateTheme = () => {
      if (darkMode.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const logout = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          await updateUserStatus(user.uid, "offline");
        }

        await signOut(auth);
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    const updateUserStatus = async (uid, status) => {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(
          userRef,
          { status, lastSeen: new Date() },
          { merge: true }
        );
      } catch (error) {
        console.error("Status update error:", error);
      }
    };

    onMounted(() => {
      // Check for system preference first
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Then check for saved preference
      const savedMode = localStorage.getItem("darkMode");

      // Set dark mode based on saved preference or system preference
      if (savedMode !== null) {
        darkMode.value = savedMode === "true";
      } else {
        darkMode.value = prefersDark;
        localStorage.setItem("darkMode", darkMode.value.toString());
      }

      updateTheme();

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user;
        if (user) {
          updateUserStatus(user.uid, "online");
        }
      });

      // Listen for system preference changes
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          // Only update if user hasn't set a preference
          if (localStorage.getItem("darkMode") === null) {
            darkMode.value = e.matches;
            updateTheme();
          }
        });
    });

    return {
      darkMode,
      toggleDarkMode,
      isAuthenticated,
      logout,
    };
  },
};
</script>
