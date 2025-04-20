/* eslint-disable */
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCO3eTlQ9u5rm0iI40jVvjWCBwHRTxy5FE",
  authDomain: "chat-app-85230.firebaseapp.com",
  projectId: "chat-app-85230",
  storageBucket: "chat-app-85230.firebasestorage.app",
  messagingSenderId: "797833655420",
  appId: "1:797833655420:web:49b2e135dd5bc25ba985f9",
  measurementId: "G-523T8JKXSE",
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  // Customize notification here
  const notificationTitle = payload.notification.title || "New Message";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/icon.png",
    badge: "/badge.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there is already a window/tab open with the target URL
        const chatId = event.notification.data?.chatId;
        if (!chatId) return;

        const url = chatId.includes("_")
          ? `/chat/${chatId}`
          : `/group/${chatId}`;

        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }

        // If no window/tab is already open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
