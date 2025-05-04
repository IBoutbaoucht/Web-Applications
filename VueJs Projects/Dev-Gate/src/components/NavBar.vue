<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center">
            <code-icon class="h-8 w-8 text-indigo-600" />
            <span class="ml-2 text-xl font-bold text-gray-800 dark:text-white"
              >DevGate</span
            >
          </router-link>
          <div class="hidden md:block ml-10">
            <div class="flex items-baseline space-x-4">
              <router-link
                to="/dashboard"
                class="nav-link"
                :class="{ active: $route.path === '/dashboard' }"
              >
                <layout-dashboard-icon class="h-5 w-5 mr-1" />
                Dashboard
              </router-link>
              <router-link
                to="/skills"
                class="nav-link"
                :class="{ active: $route.path === '/skills' }"
              >
                <code-icon class="h-5 w-5 mr-1" />
                Skills
              </router-link>
              <router-link
                to="/projects"
                class="nav-link"
                :class="{ active: $route.path === '/projects' }"
              >
                <folder-icon class="h-5 w-5 mr-1" />
                Projects
              </router-link>
              <router-link
                to="/timeline"
                class="nav-link"
                :class="{ active: $route.path === '/timeline' }"
              >
                <activity-icon class="h-5 w-5 mr-1" />
                Timeline
              </router-link>
              <router-link
                to="/objectives"
                class="nav-link"
                :class="{ active: $route.path === '/objectives' }"
              >
                <target-icon class="h-5 w-5 mr-1" />
                Objectives
              </router-link>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="p-2 rounded-md">
            <sun-icon v-if="isDarkMode" class="h-5 w-5 text-yellow-400" />
            <moon-icon
              v-else
              class="h-5 w-5 text-gray-700 dark:text-gray-300"
            />
          </button>

          <!-- Notifications Component -->
          <notifications class="notifications-container" />

          <div class="ml-3 relative">
            <div>
              <button
                @click="toggleUserMenu"
                class="flex items-center text-sm rounded-full focus:outline-none"
              >
                <img
                  v-if="currentUser?.photoURL"
                  :src="currentUser.photoURL"
                  alt="Profile"
                  class="h-8 w-8 rounded-full"
                />
                <user-icon
                  v-else
                  class="h-8 w-8 p-1 rounded-full bg-gray-200 text-gray-700"
                />
                <span class="ml-2 hidden md:block">{{
                  currentUser?.displayName || currentUser?.email
                }}</span>
                <chevron-down-icon class="ml-1 h-4 w-4" />
              </button>
            </div>
            <div
              v-if="showUserMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5"
            >
              <button
                @click="logout"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <log-out-icon class="h-4 w-4 inline mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { createOrUpdateUserProfile } from "../firebase/users";
import Notifications from "./notifications-panel.vue";
import {
  Code as CodeIcon,
  LayoutDashboard as LayoutDashboardIcon,
  Folder as FolderIcon,
  Activity as ActivityIcon,
  Target as TargetIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  LogOut as LogOutIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
} from "lucide-vue-next";

const currentUser = inject("currentUser");
const router = useRouter();
const showUserMenu = ref(false);
const isDarkMode = ref(false);

// Ensure user has a profile in the users collection
createOrUpdateUserProfile();

onMounted(() => {
  // Check if user has dark mode preference
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    isDarkMode.value = true;
  } else {
    document.documentElement.classList.remove("dark");
    isDarkMode.value = false;
  }

  // Ensure user has a profile in the users collection
  // if (auth.currentUser) {
  //   createOrUpdateUserProfile();
  // }
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}
.nav-link.active {
  @apply bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200;
}
</style>
