// src/stores/playlists.js
import { defineStore } from 'pinia';
import spotifyService from '../services/spotify';
import firebaseService from '../services/firebase';
import { useAuthStore } from './auth';

export const usePlaylistStore = defineStore('playlists', {
  state: () => ({
    userPlaylists: [],
    currentPlaylist: null,
    likedSongs: [],
    loading: false,
    error: null
  }),

  getters: {
    getUserPlaylists: (state) => state.userPlaylists,
    getCurrentPlaylist: (state) => state.currentPlaylist,
    getLikedSongs: (state) => state.likedSongs
  },

  actions: {
    async fetchUserPlaylists() {
      this.loading = true;
      try {
        const playlists = await spotifyService.getUserPlaylists();
        this.userPlaylists = playlists;
      } catch (error) {
        console.error('Error fetching playlists:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchPlaylist(playlistId) {
      this.loading = true;
      try {
        const playlist = await spotifyService.getPlaylist(playlistId);
        this.currentPlaylist = playlist;

        // Cache the playlist in Firebase
        const authStore = useAuthStore();
        if (authStore.user) {
          await firebaseService.cachePlaylist(authStore.user.uid, playlist);
        }

        return playlist;
      } catch (error) {
        console.error('Error fetching playlist:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchLikedSongs() {
      this.loading = true;
      try {
        const likedSongs = await spotifyService.getUserSavedTracks();
        this.likedSongs = likedSongs;
        return likedSongs;
      } catch (error) {
        console.error('Error fetching liked songs:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createPlaylist(name, description = '', isPublic = false) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.spotifyUser) {
          throw new Error('User not authenticated with Spotify');
        }

        const newPlaylist = await spotifyService.createPlaylist(
          authStore.spotifyUser.id,
          name,
          description,
          isPublic
        );

        // Add to playlists array
        this.userPlaylists.push(newPlaylist);

        return newPlaylist;
      } catch (error) {
        console.error('Error creating playlist:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addTrackToPlaylist(playlistId, trackUri) {
      try {
        await spotifyService.addTracksToPlaylist(playlistId, [trackUri]);

        // If this is the current playlist, refresh it
        if (this.currentPlaylist && this.currentPlaylist.id === playlistId) {
          await this.fetchPlaylist(playlistId);
        }
      } catch (error) {
        console.error('Error adding track to playlist:', error);
        this.error = error.message;
        throw error;
      }
    },

    async toggleLikeSong(track) {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      try {
        // Check if the song is already liked
        const isLiked = this.likedSongs.some(item => item.track.id === track.id);

        if (isLiked) {
          // Unlike the track
          await spotifyService.removeTrack(track.id);
          await firebaseService.removeLikedSong(authStore.user.uid, track.id);

          // Update local state
          this.likedSongs = this.likedSongs.filter(item => item.track.id !== track.id);
        } else {
          // Like the track
          await spotifyService.saveTrack(track.id);
          await firebaseService.addLikedSong(authStore.user.uid, track);

          // Update local state
          this.likedSongs.push({
            added_at: new Date().toISOString(),
            track: track
          });
        }

        return !isLiked; // Return the new liked state
      } catch (error) {
        console.error('Error toggling like status:', error);
        this.error = error.message;
        throw error;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
