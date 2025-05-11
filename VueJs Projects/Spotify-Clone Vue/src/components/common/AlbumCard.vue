<!-- src/components/common/AlbumCard.vue -->
<template>
    <div 
      class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
      @click="navigateToAlbum"
    >
      <div class="relative mb-4 group">
        <img 
          :src="album.images?.[0]?.url || '/placeholder.jpg'" 
          alt="Album cover" 
          class="w-full aspect-square object-cover rounded-md shadow-lg" 
        />
        <button 
          @click.stop="playAlbum" 
          class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play class="w-5 h-5 text-black" />
        </button>
      </div>
      <h3 class="font-medium truncate">{{ album.name }}</h3>
      <p class="text-sm text-zinc-400 truncate">
        {{ album.artists?.map(artist => artist.name).join(', ') }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { Play } from 'lucide-vue-next';
  import { usePlayerStore } from '../../stores/player';
  import spotifyService from '../../services/spotify';
  
  const props = defineProps({
    album: {
      type: Object,
      required: true
    }
  });
  
  const router = useRouter();
  const playerStore = usePlayerStore();
  
  const navigateToAlbum = () => {
    router.push(`/album/${props.album.id}`);
  };
  
  const playAlbum = async () => {
    try {
      // Get album tracks
      const albumData = await spotifyService.getAlbum(props.album.id);
      
      if (albumData.tracks.items.length > 0) {
        // Play the first track
        const firstTrack = albumData.tracks.items[0];
        playerStore.playTrack(firstTrack);
        
        // Add the rest to the queue
        albumData.tracks.items.slice(1).forEach(track => {
          playerStore.addToQueue(track);
        });
      }
    } catch (error) {
      console.error('Error playing album:', error);
    }
  };
  </script>