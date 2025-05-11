<!-- src/components/layout/Sidebar.vue -->
<template>
    <aside class="bg-black w-64 flex-shrink-0 h-full overflow-y-auto transition-all duration-300">
      <div class="p-6">
        <div class="flex items-center gap-2 mb-8">
          <Music class="w-8 h-8 text-green-500" />
          <span class="text-xl font-bold">Spotify</span>
        </div>
        
        <nav class="space-y-6">
          <div>
            <h3 class="text-xs uppercase text-zinc-400 font-bold mb-2">Menu</h3>
            <ul class="space-y-2">
              <li>
                <router-link 
                  to="/" 
                  class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                  :class="{ 'bg-zinc-800': $route.path === '/' }"
                >
                  <Home class="w-5 h-5" />
                  <span>Home</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/search" 
                  class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                  :class="{ 'bg-zinc-800': $route.path === '/search' }"
                >
                  <Search class="w-5 h-5" />
                  <span>Search</span>
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/library" 
                  class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                  :class="{ 'bg-zinc-800': $route.path.startsWith('/library') }"
                >
                  <Library class="w-5 h-5" />
                  <span>Your Library</span>
                </router-link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-xs uppercase text-zinc-400 font-bold mb-2">Playlists</h3>
            <ul class="space-y-2">
              <li>
                <button 
                  @click="createPlaylist" 
                  class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                >
                  <PlusSquare class="w-5 h-5" />
                  <span>Create Playlist</span>
                </button>
              </li>
              <li>
                <router-link 
                  to="/liked" 
                  class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800"
                  :class="{ 'bg-zinc-800': $route.path === '/liked' }"
                >
                  <Heart class="w-5 h-5 text-green-500" />
                  <span>Liked Songs</span>
                </router-link>
              </li>
            </ul>
          </div>
          
          <div v-if="playlists.length > 0">
            <div class="border-t border-zinc-800 pt-4">
              <ul class="space-y-2 max-h-64 overflow-y-auto">
                <li v-for="playlist in playlists" :key="playlist.id">
                  <router-link 
                    :to="`/playlist/${playlist.id}`" 
                    class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-zinc-800 text-left"
                    :class="{ 'bg-zinc-800': $route.path === `/playlist/${playlist.id}` }"
                  >
                    <span class="truncate">{{ playlist.name }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Home, Search, Library, PlusSquare, Heart, Music } from 'lucide-vue-next';
  import { usePlaylistStore } from '../../stores/playlists';
  import { useAuthStore } from '../../stores/auth';
  
  const router = useRouter();
  const playlistStore = usePlaylistStore();
  const authStore = useAuthStore();
  const playlists = ref([]);
  
  onMounted(async () => {
    if (authStore.isAuthenticated) {
      await fetchPlaylists();
    }
  });
  
  const fetchPlaylists = async () => {
    try {
      await playlistStore.fetchUserPlaylists();
      playlists.value = playlistStore.getUserPlaylists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };
  
  const createPlaylist = async () => {
    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }
    
    try {
      const newPlaylist = await playlistStore.createPlaylist(
        `My Playlist #${playlists.value.length + 1}`
      );
      
      // Navigate to the new playlist
      router.push(`/playlist/${newPlaylist.id}`);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };
  </script>