<!-- src/components/common/TrackList.vue -->
<template>
    <div class="bg-zinc-800/20 rounded-md overflow-hidden">
      <table class="w-full">
        <thead class="border-b border-zinc-700">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-zinc-400">#</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-zinc-400">Title</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden md:table-cell">Album</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-zinc-400 hidden lg:table-cell">Date added</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-zinc-400">
              <Clock class="w-5 h-5 inline-block" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(track, index) in tracks" 
            :key="track.id || index"
            class="hover:bg-zinc-700/30 group"
          >
            <td class="px-4 py-3 text-zinc-400">
              <div class="flex items-center">
                <span class="group-hover:hidden">{{ index + 1 }}</span>
                <Play 
                  class="w-4 h-4 hidden group-hover:block cursor-pointer" 
                  @click="playTrack(track)" 
                />
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center">
                <img 
                  :src="getTrackImage(track)" 
                  alt="Album cover" 
                  class="w-10 h-10 mr-3 rounded" 
                />
                <div>
                  <div class="font-medium">{{ getTrackName(track) }}</div>
                  <div class="text-sm text-zinc-400">{{ getArtistName(track) }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-zinc-400 hidden md:table-cell">{{ getAlbumName(track) }}</td>
            <td class="px-4 py-3 text-zinc-400 hidden lg:table-cell">{{ formatDate(track.added_at) }}</td>
            <td class="px-4 py-3 text-zinc-400 text-right">{{ formatDuration(track.duration_ms || track.track?.duration_ms) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { Clock, Play } from 'lucide-vue-next';
  import { usePlayerStore } from '../../stores/player';
  
  const props = defineProps({
    tracks: {
      type: Array,
      required: true
    }
  });
  
  const playerStore = usePlayerStore();
  
  // Methods
  const playTrack = (track) => {
    // Handle both track and track.track formats (from different API endpoints)
    const actualTrack = track.track || track;
    playerStore.playTrack(actualTrack);
  };
  
  const getTrackImage = (track) => {
    const actualTrack = track.track || track;
    if (actualTrack.album?.images?.length > 0) {
      return actualTrack.album.images[0].url;
    }
    return '/placeholder.jpg';
  };
  
  const getTrackName = (track) => {
    const actualTrack = track.track || track;
    return actualTrack.name;
  };
  
  const getArtistName = (track) => {
    const actualTrack = track.track || track;
    return actualTrack.artists?.map(artist => artist.name).join(', ') || '';
  };
  
  const getAlbumName = (track) => {
    const actualTrack = track.track || track;
    return actualTrack.album?.name || '';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatDuration = (ms) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  </script>