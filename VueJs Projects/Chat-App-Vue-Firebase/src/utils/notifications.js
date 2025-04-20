/* eslint-disable */
import { messaging, db, getFCMToken } from "@/firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

// Sound notification
export const playNotificationSound = () => {
  try {
    const audio = new Audio("/notification-sound.mp3"); // add this file to public folder
    audio.volume = 0.3;
    audio.play().catch((e) => console.warn("Sound playback failed:", e));
  } catch (error) {
    console.error("Sound error:", error);
  }
};

// Vibration
export const vibrateDevice = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// Store FCM token in Firestore
export const saveFCMToken = async (token) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { fcmToken: token }, { merge: true });
    console.log("FCM token saved to Firestore");
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

// Combined initialization function
export const initializeNotifications = async (callback) => {
  try {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return null;
    }

    // Request permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.warn("Notification permission not granted");
      return null;
    }

    // Get FCM token
    const token = await getFCMToken();
    if (!token) {
      console.error("Failed to retrieve FCM token");
      return null;
    }

    console.log("FCM Token:", token);

    // Save token to user profile
    await saveFCMToken(token);

    // Setup foreground handler if messaging is available
    if (messaging) {
      try {
        messaging.onMessage((payload) => {
          console.log("Foreground message received:", payload);

          // Play notification sound
          playNotificationSound();

          // Show local notification
          showLocalNotification(payload.notification?.title || "New Message", {
            body: payload.notification?.body || "",
            data: payload.data || {},
          });

          // Call the callback if provided
          if (callback) callback(payload);
        });
      } catch (error) {
        console.error("Error setting up message handler:", error);
      }
    }

    return token;
  } catch (error) {
    console.error("Notification initialization failed:", error);
    return null;
  }
};

// Local notification helper
export const showLocalNotification = (title, options = {}) => {
  if (Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body: options.body || "",
        icon: "/icon.png",
        data: options.data || {},
        silent: false,
      });

      notification.onclick = () => {
        if (options.data?.chatId) {
          window.focus();
          if (options.data.chatId.includes("_")) {
            // Private chat
            window.location.href = `/chat/${options.data.chatId}`;
          } else {
            // Group chat
            window.location.href = `/group/${options.data.chatId}`;
          }
        }
      };

      // Vibrate device if supported
      vibrateDevice();
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  } else {
    console.warn("Notification permission not granted");
  }
};

// Create a notification in Firestore
export const createNotification = async (recipientId, title, body, chatId) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !recipientId) return;

    // Don't notify yourself
    if (currentUser.uid === recipientId) return;

    await addDoc(collection(db, "notifications"), {
      recipientId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      title,
      body,
      chatId,
      read: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
