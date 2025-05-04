<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar v-if="isAuthenticated" />
    <div class="container mx-auto px-4 py-8">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { createOrUpdateUserProfile } from "@/firebase/users";
import Navbar from "@/components/NavBar.vue";

const isAuthenticated = ref(false);
const currentUser = ref(null);
const router = useRouter();

// Provide authentication state to all components
provide("isAuthenticated", isAuthenticated);
provide("currentUser", currentUser);

let initialRoute = ref(null); // Store initial route in a ref

onMounted(() => {
  initialRoute.value = router.currentRoute.value.path; // Store initial route

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isAuthenticated.value = true;
      currentUser.value = user;

      // Create/update user profile in Firestore
      await createOrUpdateUserProfile();

      // If user is on login page, redirect to dashboard
      if (initialRoute.value === "/login") {
        router.push("/dashboard");
      }
    } else {
      isAuthenticated.value = false;
      currentUser.value = null;

      // If user is not on login page, redirect to login
      if (initialRoute.value !== "/login") {
        router.push("/login");
      }
    }
  });
});
</script>
