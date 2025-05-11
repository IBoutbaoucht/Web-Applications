<!-- src/components/common/PlaylistCard.vue -->
<template>
    <div 
      class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
      @click="navigateToPlaylist"
    >
      <div class="relative mb-4 group">
        <img 
          :src="playlist.images?.[0]?.url || '/placeholder.jpg'" 
          alt="Playlist cover" 
          class="w-full aspect-square object-cover rounded-md shadow-lg" 
        />
        <button 
          @click.stop="playPlaylist" 
          class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play class="w-5 h-5 text-black" />
        </button>
      </div>
      <h3 class="font-medium truncate">{{ playlist.name }}</h3>
      <p class="text-sm text-zinc-400 truncate">
        By {{ playlist.owner?.display_name || 'Unknown' }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { Play } from 'lucide-vue-next';
  import { usePlayerStore } from '../../stores/player';
  import spotifyService from '../../services/spotify';
  
  const props = defineProps({
    playlist: {
      type: Object,
      required: true
    }
  });
  
  const router = useRouter();
  const playerStore = usePlayerStore();
  
  const navigateToPlaylist = () => {
    router.push(`/playlist/${props.playlist.id}`);
  };
  
  const playPlaylist = async () => {
    try {
      // Get playlist tracks
      const playlistData = await spotifyService.getPlaylist(props.playlist.id);
      
      if (playlistData.tracks.items.length > 0) {
        // Play the first track
        const firstTrack = playlistData.tracks.items[0].track;
        playerStore.playTrack(firstTrack);
        
        // Add the rest to the queue
        playlistData.tracks.items.slice(1).forEach(item => {
          if (item.track) {
            playerStore.addToQueue(item.track);
          }
        });
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };
  </script>