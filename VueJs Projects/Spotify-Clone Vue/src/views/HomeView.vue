<!-- src/views/Home.vue -->
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Good {{ timeOfDay }}</h1>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>

    <template v-else>
      <!-- Recently Played -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <button
          v-for="item in recentlyPlayed"
          :key="item.id"
          @click="playItem(item.track || item)"
          class="flex items-center bg-zinc-800/50 hover:bg-zinc-700/50 rounded-md overflow-hidden"
        >
          <img
            :src="getImageUrl(item.track || item)"
            alt="Album cover"
            class="w-12 h-12 object-cover"
          />
          <span class="ml-4 font-medium truncate">
            {{ (item.track || item).name }}
          </span>
        </button>
      </div>

      <!-- Made for you -->
      <h2 class="text-2xl font-bold mb-4">Made for you</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
        <div
          v-for="item in recommendations"
          :key="item.id"
          @click="playItem(item)"
          class="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors cursor-pointer"
        >
          <div class="relative mb-4 group">
            <img
              :src="getImageUrl(item)"
              alt="Recommendation cover"
              class="w-full h-auto rounded-md"
            />
          </div>
          <h3 class="font-semibold text-sm truncate">{{ item.name }}</h3>
          <p class="text-xs text-zinc-400 truncate">
            {{ item.description || item.artists?.map(a => a.name).join(', ') }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import spotifyService from '../services/spotify';

export default {
  name: 'Home',
  setup() {
    const loading = ref(true);
    const recentlyPlayed = ref([]);
    const recommendations = ref([]);

    const getImageUrl = (item) => {
      return item?.album?.images?.[0]?.url || item?.images?.[0]?.url || '';
    };

    const playItem = (item) => {
      console.log('Play item:', item); // You can replace this with your player logic
    };

    const timeOfDay = computed(() => {
      const hour = new Date().getHours();
      if (hour < 12) return 'morning';
      if (hour < 18) return 'afternoon';
      return 'evening';
    });

    onMounted(async () => {
      try {
        const recent = await spotifyService.getRecentlyPlayed();
        recentlyPlayed.value = recent;

        const recs = await spotifyService.getRecommendations();
        recommendations.value = recs;
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      recentlyPlayed,
      recommendations,
      getImageUrl,
      playItem,
      timeOfDay
    };
  }
};
</script>

<style scoped>
/* Add optional custom styles here */
</style>
