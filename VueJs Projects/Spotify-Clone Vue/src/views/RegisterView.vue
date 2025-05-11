<!-- src/views/Register.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-black p-4">
      <div class="max-w-md w-full bg-zinc-900 rounded-lg shadow-lg p-8">
        <div class="flex justify-center mb-6">
          <Music class="w-12 h-12 text-green-500" />
        </div>
        
        <h1 class="text-2xl font-bold text-center mb-6">Sign up for Spotify</h1>
        
        <div v-if="error" class="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-md mb-4">
          {{ error }}
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="name" 
              required
              class="w-full px-3 py-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email address</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required
              class="w-full px-3 py-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
              class="w-full px-3 py-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              required
              class="w-full px-3 py-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-green-500 text-black font-bold py-3 px-4 rounded-full hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading">
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></span>
              Creating account...
            </span>
            <span v-else>Sign Up</span>
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-zinc-400">Already have an account?</p>
          <router-link to="/login" class="text-white font-medium hover:underline">
            Log in
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { Music } from 'lucide-vue-next';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  const error = ref('');
  
  const handleRegister = async () => {
    if (!name.value || !email.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields';
      return;
    }
    
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    try {
      await authStore.register(email.value, password.value, name.value);
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
      error.value = err.message || 'Failed to create account. Please try again.';
    } finally {
      loading.value = false;
    }
  };
  </script>