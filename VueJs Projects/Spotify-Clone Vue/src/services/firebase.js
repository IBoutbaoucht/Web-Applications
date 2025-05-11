// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default {
  // Auth methods
  async register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        createdAt: new Date(),
        likedSongs: [],
        recentlyPlayed: []
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
  
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  },
  
  // User data methods
  async getUserData(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No user data found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },
  
  // Liked songs methods
  async addLikedSong(userId, track) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        likedSongs: arrayUnion(track)
      });
    } catch (error) {
      console.error('Error adding liked song:', error);
      throw error;
    }
  },
  
  async removeLikedSong(userId, trackId) {
    try {
      // First get the current liked songs
      const userData = await this.getUserData(userId);
      const likedSongs = userData.likedSongs || [];
      
      // Find and remove the track
      const updatedLikedSongs = likedSongs.filter(song => song.id !== trackId);
      
      // Update the document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        likedSongs: updatedLikedSongs
      });
    } catch (error) {
      console.error('Error removing liked song:', error);
      throw error;
    }
  },
  
  // Recently played methods
  async addRecentlyPlayed(userId, track) {
    try {
      // Get current recently played
      const userData = await this.getUserData(userId);
      let recentlyPlayed = userData.recentlyPlayed || [];
      
      // Remove the track if it already exists
      recentlyPlayed = recentlyPlayed.filter(item => item.id !== track.id);
      
      // Add the track to the beginning
      recentlyPlayed.unshift({
        ...track,
        playedAt: new Date()
      });
      
      // Limit to 50 tracks
      if (recentlyPlayed.length > 50) {
        recentlyPlayed = recentlyPlayed.slice(0, 50);
      }
      
      // Update the document
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        recentlyPlayed
      });
    } catch (error) {
      console.error('Error adding recently played:', error);
      throw error;
    }
  },
  
  // User preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { preferences });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },
  
  // Playlist cache
  async cachePlaylist(userId, playlist) {
    try {
      const userRef = doc(db, 'users', userId);
      const playlistsRef = collection(userRef, 'playlists');
      await setDoc(doc(playlistsRef, playlist.id), {
        ...playlist,
        cachedAt: new Date()
      });
    } catch (error) {
      console.error('Error caching playlist:', error);
      throw error;
    }
  }
};