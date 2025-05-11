<!-- src/components/layout/Player.vue -->
<template>
    <footer class="bg-zinc-900 border-t border-zinc-800 p-4">
      <div class="flex items-center justify-between">
        <!-- Track Info -->
        <div class="flex items-center w-1/3">
          <div v-if="currentTrack" class="flex items-center">
            <img 
              :src="currentTrack.album?.images[0]?.url || '/placeholder.jpg'" 
              alt="Album cover" 
              class="w-14 h-14 mr-3 rounded"
            />
            <div>
              <div class="font-medium">{{ currentTrack.name }}</div>
              <div class="text-sm text-zinc-400">
                {{ currentTrack.artists?.map(artist => artist.name).join(', ') }}
              </div>
            </div>
            <button class="ml-4 text-zinc-400 hover:text-white" @click="toggleLike">
              <Heart 
                class="w-5 h-5" 
                :class="{ 'text-green-500': isLiked }" 
                :fill="isLiked ? '#22c55e' : 'none'" 
              />
            </button>
          </div>
        </div>
        
        <!-- Player Controls -->
        <div class="flex flex-col items-center w-1/3">
          <div class="flex items-center gap-4 mb-2">
            <button 
              class="text-zinc-400 hover:text-white"
              @click="playerStore.toggleShuffle"
              :class="{ 'text-green-500': playerStore.shuffle }"
            >
              <Shuffle class="w-5 h-5" />
            </button>
            <button class="text-zinc-400 hover:text-white">
              <SkipBack class="w-5 h-5" />
            </button>
            <button 
              @click="playerStore.togglePlay" 
              class="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
              <component :is="isPlaying ? Pause : Play" class="w-4 h-4 text-black" />
            </button>
            <button 
              class="text-zinc-400 hover:text-white"
              @click="playerStore.playNext"
              :class="{ 'opacity-50': !playerStore.hasNext }"
            >
              <SkipForward class="w-5 h-5" />
            </button>
            <button 
              class="text-zinc-400 hover:text-white"
              @click="playerStore.toggleRepeat"
            >
              <component 
                :is="playerStore.repeat === 'one' ? RepeatOne : Repeat" 
                class="w-5 h-5"
                :class="{ 'text-green-500': playerStore.repeat !== 'off' }"
              />
            </button>
          </div>
          
          <div class="flex items-center gap-2 w-full">
            <span class="text-xs text-zinc-400">{{ formattedCurrentTime }}</span>
            <div 
              class="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer"
              @click="seek"
              ref="progressBar"
            >
              <div class="h-1 bg-white rounded-full" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="text-xs text-zinc-400">{{ formattedDuration }}</span>
          </div>
        </div>
        
        <!-- Volume Controls -->
        <div class="flex items-center justify-end w-1/3 gap-3">
          <button class="text-zinc-400 hover:text-white">
            <Mic2 class="w-5 h-5" />
          </button>
          <button class="text-zinc-400 hover:text-white">
            <ListMusic class="w-5 h-5" />
          </button>
          <button class="text-zinc-400 hover:text-white">
            <Laptop2 class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-1">
            <Volume2 class="w-5 h-5 text-zinc-400" />
            <div 
              class="w-24 h-1 bg-zinc-700 rounded-full cursor-pointer"
              @click="adjustVolume"
              ref="volumeBar"
            >
              <div class="h-1 bg-white rounded-full" :style="{ width: `${volume * 100}%` }"></div>
            </div>
          </div>
          <button class="text-zinc-400 hover:text-white">
            <Maximize2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { 
    Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, RepeatOne,
    Volume2, Mic2, ListMusic, Laptop2, Maximize2, Heart 
  } from 'lucide-vue-next';
  import { usePlayerStore } from '../../stores/player';
  import { usePlaylistStore } from '../../stores/playlists';
  import { useAuthStore } from '../../stores/auth';
  
  const playerStore = usePlayerStore();
  const playlistStore = usePlaylistStore();
  const authStore = useAuthStore();
  const progressBar = ref(null);
  const volumeBar = ref(null);
  const isLiked = ref(false);
  
  // Computed properties
  const currentTrack = computed(() => playerStore.currentTrack);
  const isPlaying = computed(() => playerStore.isPlaying);
  const progress = computed(() => playerStore.progress);
  const formattedCurrentTime = computed(() => playerStore.formattedCurrentTime);
  const formattedDuration = computed(() => playerStore.formattedDuration);
  const volume = computed(() => playerStore.volume);
  
  // Methods
  const seek = (event) => {
    if (!progressBar.value) return;
    
    const rect = progressBar.value.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    
    playerStore.seekByPercentage(percentage);
  };
  
  const adjustVolume = (event) => {
    if (!volumeBar.value) return;
    
    const rect = volumeBar.value.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, offsetX / rect.width));
    
    playerStore.setVolume(newVolume);
  };
  
  const toggleLike = async () => {
    if (!authStore.user || !currentTrack.value) return;
    
    try {
      const newLikedState = await playlistStore.toggleLikeSong(currentTrack.value);
      isLiked.value = newLikedState;
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  // Check if current track is liked
  const checkIfLiked = async () => {
    if (!authStore.user || !currentTrack.value) return;
    
    try {
      const likedSongs = await playlistStore.fetchLikedSongs();
      isLiked.value = likedSongs.some(item => item.track.id === currentTrack.value.id);
    } catch (error) {
      console.error('Error checking if track is liked:', error);
    }
  };
  
  // Watch for track changes
  watch(() => currentTrack.value, () => {
    if (currentTrack.value && authStore.isAuthenticated) {
      checkIfLiked();
    }
  });
  
  onMounted(() => {
    playerStore.initAudio();
    if (currentTrack.value && authStore.isAuthenticated) {
      checkIfLiked();
    }
  });
  </script>