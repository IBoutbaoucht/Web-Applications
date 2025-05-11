// src/stores/player.js
import { defineStore } from 'pinia';
import firebaseService from '../services/firebase';
import { useAuthStore } from './auth';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    audioElement: null,
    repeat: 'off', // 'off', 'all', 'one'
    shuffle: false
  }),
  
  getters: {
    progress: (state) => state.duration ? (state.currentTime / state.duration) * 100 : 0,
    formattedCurrentTime: (state) => formatTime(state.currentTime),
    formattedDuration: (state) => formatTime(state.duration),
    hasNext: (state) => state.queue.length > 0
  },
  
  actions: {
    initAudio() {
      if (!this.audioElement) {
        this.audioElement = new Audio();
        
        this.audioElement.addEventListener('timeupdate', () => {
          this.currentTime = this.audioElement.currentTime;
        });
        
        this.audioElement.addEventListener('loadedmetadata', () => {
          this.duration = this.audioElement.duration;
        });
        
        this.audioElement.addEventListener('ended', () => {
          this.playNext();
        });
        
        this.audioElement.volume = this.volume;
      }
    },
    
    async playTrack(track) {
      const authStore = useAuthStore();
      
      if (!track.preview_url) {
        console.error('No preview URL available for this track');
        return;
      }
      
      this.initAudio();
      
      // Update current track
      this.currentTrack = track;
      
      // Set audio source and play
      this.audioElement.src = track.preview_url;
      await this.audioElement.play();
      this.isPlaying = true;
      
      // Save to recently played in Firebase
      if (authStore.user) {
        await firebaseService.addRecentlyPlayed(authStore.user.uid, track);
      }
    },
    
    async togglePlay() {
      this.initAudio();
      
      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
      } else if (this.currentTrack) {
        await this.audioElement.play();
        this.isPlaying = true;
      }
    },
    
    setVolume(value) {
      this.volume = value;
      if (this.audioElement) {
        this.audioElement.volume = value;
      }
    },
    
    seek(time) {
      if (this.audioElement) {
        this.audioElement.currentTime = time;
      }
    },
    
    seekByPercentage(percentage) {
      if (this.audioElement && this.duration) {
        const time = (percentage / 100) * this.duration;
        this.seek(time);
      }
    },
    
    addToQueue(track) {
      this.queue.push(track);
    },
    
    clearQueue() {
      this.queue = [];
    },
    
    async playNext() {
      if (this.queue.length > 0) {
        const nextTrack = this.queue.shift();
        await this.playTrack(nextTrack);
      } else if (this.repeat === 'all' && this.currentTrack) {
        // If repeat all is enabled, play the current track again
        await this.playTrack(this.currentTrack);
      } else if (this.repeat === 'one' && this.currentTrack) {
        // If repeat one is enabled, restart the current track
        this.seek(0);
        await this.audioElement.play();
        this.isPlaying = true;
      } else {
        this.isPlaying = false;
      }
    },
    
    toggleShuffle() {
      this.shuffle = !this.shuffle;
      if (this.shuffle && this.queue.length > 1) {
        // Shuffle the queue
        for (let i = this.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
      }
    },
    
    toggleRepeat() {
      if (this.repeat === 'off') this.repeat = 'all';
      else if (this.repeat === 'all') this.repeat = 'one';
      else this.repeat = 'off';
    }
  }
});

// Helper function to format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}