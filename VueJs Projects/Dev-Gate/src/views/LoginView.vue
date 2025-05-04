<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <code-icon class="h-16 w-16 text-indigo-600" />
      </div>
      <h2
        class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Welcome to DevGate
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Track your developer journey, showcase your skills, and connect with
        others
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
      >
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {{ error }}
        </div>

        <form class="space-y-6" @submit.prevent="handleEmailLogin">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <loader-icon v-if="loading" class="animate-spin h-5 w-5 mr-2" />
              Sign in
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div
                class="w-full border-t border-gray-300 dark:border-gray-600"
              ></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400"
                >Or continue with</span
              >
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="handleGoogleLogin"
              :disabled="loading"
              class="flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                class="h-5 w-5 mr-2"
              />
              Google
            </button>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-center">
          <div class="text-sm">
            <button
              @click="toggleMode"
              class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {{
                isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { Code as CodeIcon, Loader as LoaderIcon } from "lucide-vue-next";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const isLogin = ref(true);

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
};

const handleEmailLogin = async () => {
  if (!email.value || !password.value) return;

  loading.value = true;
  error.value = "";

  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
    router.push("/dashboard");
  } catch (err) {
    // console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/dashboard");
  } catch (err) {
    // console.error(err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
