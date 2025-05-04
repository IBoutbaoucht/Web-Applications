import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "./index";

// Create or update a user profile in the users collection
export const createOrUpdateUserProfile = async (userData = {}) => {
  if (!auth.currentUser) return null;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    // Default data to capture
    const defaultUserData = {
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      lastLogin: serverTimestamp(),
    };

    if (!userDoc.exists()) {
      // First time user - create profile
      await setDoc(userRef, {
        ...defaultUserData,
        ...userData,
        createdAt: serverTimestamp(),
      });
      return { id: auth.currentUser.uid, ...defaultUserData, ...userData };
    } else {
      // Update existing profile
      const mergedData = {
        ...defaultUserData,
        ...userData,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(userRef, mergedData);
      return { id: auth.currentUser.uid, ...userDoc.data(), ...mergedData };
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
};

// Search for users by email
export const searchUsersByEmail = async (email) => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email.toLowerCase())
    );
    const snapshot = await getDocs(usersQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
};

// Get a user by ID
export const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
