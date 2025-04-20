/* eslint-disable */
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          {{ isSignUp ? "Create your account" : "Sign in to your account" }}
        </h2>
      </div>
      <div class="mt-8 space-y-6">
        <div
          v-if="error"
          class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
        >
          <p>{{ error }}</p>
        </div>
        <div class="rounded-md shadow-sm -space-y-px">
          <div v-if="isSignUp">
            <label for="name" class="sr-only">Full Name</label>
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              :class="[
                'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white',
                isSignUp ? '' : 'rounded-t-md',
              ]"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            @click="isSignUp ? register() : login()"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="loading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ isSignUp ? "Sign up" : "Sign in" }}
          </button>
        </div>

        <div class="text-center">
          <button
            @click="toggleMode"
            class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{
              isSignUp
                ? "Already have an account? Sign in"
                : "Need an account? Sign up"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { showToast } from "@/utils/toast";

export default {
  setup() {
    const router = useRouter();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const isSignUp = ref(true);
    const error = ref("");
    const loading = ref(false);

    const toggleMode = () => {
      isSignUp.value = !isSignUp.value;
      error.value = "";
      name.value = "";
      email.value = "";
      password.value = "";
    };

    const register = async () => {
      loading.value = true;
      error.value = "";

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        await updateProfile(userCredential.user, { displayName: name.value });
        await saveUser(userCredential.user);
        router.push("/");
        showToast("Registered successfully", "success");
      } catch (err) {
        handleAuthError(err);
      } finally {
        loading.value = false;
      }
    };

    const login = async () => {
      loading.value = true;
      error.value = "";

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        await updateUserStatus(userCredential.user.uid, "online");
        router.push("/");
        showToast("Logged in successfully", "success");
      } catch (err) {
        handleAuthError(err);
      } finally {
        loading.value = false;
      }
    };

    const saveUser = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: name.value || user.displayName,
          status: "online",
          createdAt: new Date(),
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error("Firestore save error:", err);
        showToast("Failed to save user data", "error");
        throw err;
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
      } catch (err) {
        console.error("Status update error:", err);
        showToast("Failed to update user status", "error");
      }
    };

    const handleAuthError = (err) => {
      switch (err.code) {
        case "auth/email-already-in-use":
          error.value = "Email already in use. Please login instead.";
          isSignUp.value = false;
          break;
        case "auth/wrong-password":
          error.value = "Incorrect password. Please try again.";
          break;
        case "auth/user-not-found":
          error.value = "No account found. Please sign up first.";
          isSignUp.value = true;
          break;
        case "auth/too-many-requests":
          error.value = "Too many attempts. Please try again later.";
          break;
        case "auth/invalid-email":
          error.value = "Invalid email format.";
          break;
        case "auth/weak-password":
          error.value = "Password should be at least 6 characters.";
          break;
        default:
          error.value =
            err.message || "Authentication failed. Please try again.";
      }
      showToast(error.value, "error");
      console.error("Auth error:", err);
    };

    return {
      name,
      email,
      password,
      isSignUp,
      error,
      loading,
      toggleMode,
      register,
      login,
    };
  },
};
</script>
