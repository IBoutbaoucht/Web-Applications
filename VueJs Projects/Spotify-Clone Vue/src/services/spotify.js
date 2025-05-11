// src/services/spotify.js
import axios from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const CLIENT_ID = '399c068e029043b69b008f5ac37fca51'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:8080'; // Must match your registered redirect URI

// Scopes define what your app can access
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
  'streaming'
].join(' ');

// Generate a random string for state verification
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

// Create the authorization URL
const getAuthUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    response_type: 'token',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Handle the callback from Spotify
const handleCallback = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const accessToken = params.get('access_token');
  const state = params.get('state');
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (accessToken && (state === null || state !== storedState)) {
    console.error('State mismatch');
    return null;
  }
  
  localStorage.removeItem('spotify_auth_state');
  
  if (accessToken) {
    localStorage.setItem('spotify_access_token', accessToken);
    const expiresIn = params.get('expires_in');
    const expirationTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem('spotify_token_expiration', expirationTime);
    return accessToken;
  }
  
  return null;
};

// Create an axios instance with auth headers
const createApiInstance = () => {
  const token = localStorage.getItem('spotify_access_token');
  return axios.create({
    baseURL: SPOTIFY_API_BASE,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Check if token is expired and redirect to login if needed
const checkTokenAndProceed = async (apiCall) => {
  const expirationTime = localStorage.getItem('spotify_token_expiration');
  const token = localStorage.getItem('spotify_access_token');
  
  if (!token || !expirationTime || Date.now() > parseInt(expirationTime)) {
    // Token is expired or missing, redirect to login
    window.location.href = getAuthUrl();
    return null;
  }
  
  try {
    return await apiCall();
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token is invalid, redirect to login
      window.location.href = getAuthUrl();
      return null;
    }
    throw error;
  }
};

// API methods
export default {
  // Auth methods
  getAuthUrl,
  handleCallback,
  logout() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
  },
  isAuthenticated() {
    const token = localStorage.getItem('spotify_access_token');
    const expiration = localStorage.getItem('spotify_token_expiration');
    return token && expiration && Date.now() < parseInt(expiration);
  },
  
  // User methods
  getCurrentUser() {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/me');
      return response.data;
    });
  },
  
  // Browse methods
  getNewReleases(limit = 20) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/browse/new-releases', {
        params: { limit }
      });
      return response.data.albums.items;
    });
  },
  
  getFeaturedPlaylists() {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/browse/featured-playlists');
      return response.data.playlists.items;
    });
  },
  
  getCategories() {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/browse/categories');
      return response.data.categories.items;
    });
  },
  
  // Playlist methods
  getUserPlaylists() {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/me/playlists');
      return response.data.items;
    });
  },
  
  getPlaylist(playlistId) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data;
    });
  },
  
  createPlaylist(userId, name, description = '', isPublic = false) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.post(`/users/${userId}/playlists`, {
        name,
        description,
        public: isPublic
      });
      return response.data;
    });
  },
  
  addTracksToPlaylist(playlistId, trackUris) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.post(`/playlists/${playlistId}/tracks`, {
        uris: trackUris
      });
      return response.data;
    });
  },
  
  // Track methods
  getUserSavedTracks(limit = 50) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/me/tracks', {
        params: { limit }
      });
      return response.data.items;
    });
  },
  
  saveTrack(trackId) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.put('/me/tracks', {
        ids: [trackId]
      });
      return response.data;
    });
  },
  
  removeTrack(trackId) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.delete('/me/tracks', {
        data: {
          ids: [trackId]
        }
      });
      return response.data;
    });
  },
  
  // Search
  search(query, types = ['track', 'album', 'artist', 'playlist']) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/search', {
        params: {
          q: query,
          type: types.join(','),
          limit: 20
        }
      });
      return response.data;
    });
  },
  
  // Player
  getRecentlyPlayed(limit = 20) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get('/me/player/recently-played', {
        params: { limit }
      });
      return response.data.items;
    });
  },
  
  getRecommendations(seedArtists = [], seedTracks = [], seedGenres = []) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const params = new URLSearchParams();
      
      if (seedArtists.length) params.append('seed_artists', seedArtists.join(','));
      if (seedTracks.length) params.append('seed_tracks', seedTracks.join(','));
      if (seedGenres.length) params.append('seed_genres', seedGenres.join(','));
      params.append('limit', '20');
      
      const response = await api.get(`/recommendations?${params.toString()}`);
      return response.data.tracks;
    });
  },
  
  // Album methods
  getAlbum(albumId) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get(`/albums/${albumId}`);
      return response.data;
    });
  },
  
  // Artist methods
  getArtist(artistId) {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get(`/artists/${artistId}`);
      return response.data;
    });
  },
  
  getArtistTopTracks(artistId, country = 'US') {
    return checkTokenAndProceed(async () => {
      const api = createApiInstance();
      const response = await api.get(`/artists/${artistId}/top-tracks`, {
        params: { country }
      });
      return response.data.tracks;
    });
  }
};