<!-- src/components/layout/TopBar.vue -->
<template>
    <header class="bg-zinc-900 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="toggleSidebar" class="md:hidden mr-4">
          <Menu class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-4">
          <button @click="goBack" class="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button @click="goForward" class="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div class="relative max-w-md w-full mx-4 hidden md:block">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="Search for songs, artists, or albums" 
          class="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          v-if="isAuthenticated"
          @click="showUserMenu = !showUserMenu" 
          class="flex items-center gap-2 bg-zinc-800 rounded-full p-1 pr-3 hover:bg-zinc-700"
        >
          <div class="w-7 h-7 rounded-full bg-zinc-600 flex items-center justify-center">
            <User class="w-4 h-4" />
          </div>
          <span class="text-sm font-medium">{{ userName }}</span>
          <ChevronDown class="w-4 h-4" />
        </button>
        
        <router-link 
          v-else
          to="/login" 
          class="bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-opacity-80"
        >
          Log in
        </router-link>
        
        <div v-if="showUserMenu" class="absolute right-6 top-16 bg-zinc-800 rounded-md shadow-lg p-2 z-10">
          <button 
            @click="logout" 
            class="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded text-sm"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
    
    <!-- Mobile Search Bar -->
    <div 
      v-if="showSearchBar" 
      class="absolute top-16 left-0 right-0 bg-zinc-900 p-4 z-10 md:hidden"
    >
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="Search for songs, artists, or albums" 
          class="w-full pl-10 pr-4 py-2 bg-zinc-800 rounded-full text-sm focus:outline-none"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Menu, ChevronLeft, ChevronRight, Search, User, ChevronDown } from 'lucide-vue-next';
  import { useAuthStore } from '../../stores/auth';
  
  const props = defineProps({
    showSidebar: Boolean
  });
  
  const emit = defineEmits(['toggle-sidebar', 'search']);
  
  const router = useRouter();
  const authStore = useAuthStore();
  const showUserMenu = ref(false);
  const showSearchBar = ref(false);
  const searchQuery = ref('');
  
  // Computed properties
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const userName = computed(() => authStore.userDisplayName);
  
  // Methods
  const toggleSidebar = () => {
    emit('toggle-sidebar');
  };
  
  const goBack = () => {
    router.go(-1);
  };
  
  const goForward = () => {
    router.go(1);
  };
  
  const handleSearch = () => {
    emit('search', searchQuery.value);
    
    if (searchQuery.value && router.currentRoute.value.path !== '/search') {
      router.push({ 
        path: '/search', 
        query: { q: searchQuery.value } 
      });
    }
  };
  
  const logout = async () => {
    await authStore.logout();
    showUserMenu.value = false;
    router.push('/login');
  };
  </script>