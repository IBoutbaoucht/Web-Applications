// src/stores/auth.js
import { defineStore } from 'pinia';
import firebaseService from '../services/firebase';
import spotifyService from '../services/spotify';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    error: null,
    spotifyUser: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user && spotifyService.isAuthenticated(),
    currentUser: (state) => state.user,
    userDisplayName: (state) => state.user?.displayName || 'User'
  },
  
  actions: {
    async init() {
      this.loading = true;
      try {
        // Check Firebase auth
        const user = await firebaseService.getCurrentUser();
        this.user = user;
        
        // Check Spotify auth
        if (window.location.hash.includes('access_token')) {
          spotifyService.handleCallback();
          // Remove the hash to clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Get Spotify user if authenticated
        if (spotifyService.isAuthenticated() && this.user) {
          this.spotifyUser = await spotifyService.getCurrentUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async register(email, password, name) {
      this.loading = true;
      this.error = null;
      try {
        const user = await firebaseService.register(email, password, name);
        this.user = user;
        
        // Redirect to Spotify login
        window.location.href = spotifyService.getAuthUrl();
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const user = await firebaseService.login(email, password);
        this.user = user;
        
        // Check if Spotify is authenticated, if not redirect
        if (!spotifyService.isAuthenticated()) {
          window.location.href = spotifyService.getAuthUrl();
        } else {
          this.spotifyUser = await spotifyService.getCurrentUser();
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.loading = true;
      try {
        await firebaseService.logout();
        spotifyService.logout();
        this.user = null;
        this.spotifyUser = null;
      } catch (error) {
        console.error('Logout error:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    clearError() {
      this.error = null;
    }
  }
});