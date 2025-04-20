/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCO3eTlQ9u5rm0iI40jVvjWCBwHRTxy5FE",
  authDomain: "chat-app-85230.firebaseapp.com",
  projectId: "chat-app-85230",
  storageBucket: "chat-app-85230.firebasestorage.app",
  messagingSenderId: "797833655420",
  appId: "1:797833655420:web:49b2e135dd5bc25ba985f9",
  measurementId: "G-523T8JKXSE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize messaging only if it's supported in the browser
export let messaging = null;
try {
  if (typeof window !== "undefined" && "Notification" in window) {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.warn("Firebase messaging initialization failed:", error);
}

export const getFCMToken = async () => {
  try {
    if (!messaging) {
      console.warn("Firebase messaging is not available");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey:
        "BHW_q_QF56gYvEuF-_Z340ywLvYK2t_D0NU0LguPm0dsViXYDW2WpGtVAt61NX3csv7e1DE6xaKkpQkgcSHaEME",
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.warn(
        "No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
