/* eslint-disable */
<template>
  <div class="notification-center relative">
    <button
      @click.stop="toggleNotifications"
      class="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
    >
      <div
        class="p-3 border-b dark:border-gray-700 flex justify-between items-center"
      >
        <h3 class="font-semibold text-gray-800 dark:text-white">
          Notifications
        </h3>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Mark all as read
        </button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div
          v-if="notifications.length === 0"
          class="p-4 text-center text-gray-500 dark:text-gray-400"
        >
          No notifications
        </div>

        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
            { 'bg-blue-50 dark:bg-blue-900/20': !notification.read },
          ]"
        >
          <div class="flex justify-between items-start">
            <div class="font-medium text-gray-800 dark:text-white">
              {{ notification.title }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatTime(notification.timestamp) }}
            </div>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {{ notification.body }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const router = useRouter();
    const notifications = ref([]);
    const showNotifications = ref(false);
    const unsubscribe = ref(null);

    const unreadCount = computed(() => {
      return notifications.value.filter((n) => !n.read).length;
    });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const handleNotificationClick = async (notification) => {
      // Mark as read
      if (!notification.read) {
        await updateDoc(doc(db, "notifications", notification.id), {
          read: true,
        });
      }

      // Navigate to the appropriate chat
      if (notification.chatId) {
        if (notification.chatId.includes("_")) {
          // Private chat
          router.push({
            name: "PrivateChat",
            params: { chatId: notification.chatId },
          });
        } else {
          // Group chat
          router.push({
            name: "GroupChat",
            params: { groupId: notification.chatId },
          });
        }
        showNotifications.value = false;
      }
    };

    const markAllAsRead = async () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      try {
        const unreadNotifications = notifications.value.filter((n) => !n.read);

        for (const notification of unreadNotifications) {
          await updateDoc(doc(db, "notifications", notification.id), {
            read: true,
          });
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "";

      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      // Less than a day
      if (diff < 24 * 60 * 60 * 1000) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      // Less than a week
      if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        return days[date.getDay()];
      }

      // Older
      return date.toLocaleDateString();
    };

    const setupNotificationListener = () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      const notificationsRef = collection(db, "notifications");
      const notificationsQuery = query(
        notificationsRef,
        where("recipientId", "==", userId),
        orderBy("timestamp", "desc")
      );

      unsubscribe.value = onSnapshot(notificationsQuery, (snapshot) => {
        notifications.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    };

    onMounted(() => {
      setupNotificationListener();

      // Close notifications when clicking outside
      document.addEventListener("click", (e) => {
        if (
          showNotifications.value &&
          !e.target.closest(".notification-center")
        ) {
          showNotifications.value = false;
        }
      });
    });

    onUnmounted(() => {
      if (unsubscribe.value) {
        unsubscribe.value();
      }
    });

    return {
      notifications,
      showNotifications,
      unreadCount,
      toggleNotifications,
      handleNotificationClick,
      markAllAsRead,
      formatTime,
    };
  },
};
</script>
