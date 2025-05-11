<!-- src/views/Callback.vue -->
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-black">
      <Music class="w-16 h-16 text-green-500 animate-pulse mb-4" />
      <h1 class="text-2xl font-bold mb-2">Connecting to Spotify...</h1>
      <p class="text-zinc-400">Please wait while we complete the authentication process.</p>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Music } from 'lucide-vue-next';
  import spotifyService from '../services/spotify';
  
  const router = useRouter();
  
  onMounted(() => {
    // Handle the callback from Spotify
    const token = spotifyService.handleCallback();
    
    if (token) {
      // Successfully authenticated with Spotify
      console.log('Successfully authenticated with Spotify');
      
      // Redirect to home page
      router.push('/');
    } else {
      // Authentication failed
      console.error('Spotify authentication failed');
      router.push('/login');
    }
  });
  </script>