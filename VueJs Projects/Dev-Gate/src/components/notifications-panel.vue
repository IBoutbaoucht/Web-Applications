<template>
  <div class="relative">
    <button
      @click="toggleNotifications"
      class="relative p-1 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
    >
      <bell-icon class="h-6 w-6" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="showNotifications"
      class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 notifications-container"
    >
      <div class="py-1 divide-y divide-gray-100 dark:divide-gray-700">
        <div class="px-4 py-3 flex justify-between items-center">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notifications
          </h3>
          <button
            v-if="notifications.length > 0"
            @click="markAllAsRead"
            class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Mark all as read
          </button>
        </div>

        <div v-if="loading" class="px-4 py-6 flex justify-center">
          <loader-icon class="animate-spin h-5 w-5 text-indigo-600" />
        </div>

        <div
          v-else-if="notifications.length === 0"
          class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          No notifications
        </div>

        <div v-else class="max-h-96 overflow-y-auto">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            :class="{
              'bg-indigo-50 dark:bg-indigo-900/20': !notification.read,
            }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-start">
                <div
                  class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <users-icon
                    v-if="notification.type === 'project_invitation'"
                    class="h-4 w-4"
                  />
                  <user-plus-icon
                    v-else-if="notification.type === 'collaboration_request'"
                    class="h-4 w-4"
                  />
                  <bell-icon v-else class="h-4 w-4" />
                </div>
                <div class="ml-3">
                  <p
                    class="text-sm font-medium"
                    :class="
                      notification.read
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-900 dark:text-white'
                    "
                  >
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatNotificationTime(notification.createdAt) }}
                  </p>
                </div>
              </div>
              <div
                v-if="!notification.read"
                class="w-2 h-2 bg-indigo-600 rounded-full"
              ></div>
            </div>
          </div>
        </div>

        <div class="px-4 py-2 text-center">
          <button
            v-if="hasMoreNotifications"
            @click="loadMoreNotifications"
            class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            View more
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Regular script tag to define the component name
export default {
  name: "NotificationsPanel",
};
</script>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  Bell as BellIcon,
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

const router = useRouter();

const showNotifications = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const loading = ref(true);
const hasMoreNotifications = ref(false);
const lastFetchedNotification = ref(null);
const notificationsPerPage = 10;
const unsubscribe = ref(null);
const isAuthReady = ref(false);

onMounted(() => {
  const authUnsubscribe = auth.onAuthStateChanged(() => {
    isAuthReady.value = true;
  });

  return () => {
    authUnsubscribe();
  };
});

// Watch for auth state and auth readiness
watch(
  [() => auth.currentUser, isAuthReady],
  ([newUser, authReady]) => {
    if (authReady) {
      if (newUser) {
        setupNotificationsListener();
      } else if (unsubscribe.value) {
        unsubscribe.value();
        unsubscribe.value = null;
        notifications.value = [];
        unreadCount.value = 0;
        hasMoreNotifications.value = false;
        lastFetchedNotification.value = null;
      }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
});

const setupNotificationsListener = () => {
  if (!auth.currentUser) return;

  // Set up real-time listener for unread count
  const unreadQuery = query(
    collection(db, "notifications"),
    where("userId", "==", auth.currentUser.uid),
    where("read", "==", false)
  );

  unsubscribe.value = onSnapshot(unreadQuery, (snapshot) => {
    unreadCount.value = snapshot.size;

    // If we have unread notifications and none are currently loaded, fetch them
    if (snapshot.size > 0 && notifications.value.length === 0) {
      fetchNotifications();
    }
  });
};

const fetchNotifications = async (isLoadMore = false) => {
  if (!auth.currentUser) return;

  loading.value = true;

  try {
    let notificationsQuery;

    if (isLoadMore && lastFetchedNotification.value) {
      notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc"),
        startAfter(lastFetchedNotification.value),
        limit(notificationsPerPage)
      );
    } else {
      notificationsQuery = query(
        collection(db, "notifications"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(notificationsPerPage)
      );
    }

    const snapshot = await getDocs(notificationsQuery);

    if (snapshot.empty) {
      hasMoreNotifications.value = false;

      if (!isLoadMore) {
        notifications.value = [];
      }

      loading.value = false;
      return;
    }

    const fetchedNotifications = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Ensure createdAt is properly handled
      let createdAt = data.createdAt;
      if (createdAt && typeof createdAt.toDate === "function") {
        createdAt = createdAt.toDate();
      } else if (createdAt && createdAt.seconds) {
        // Handle Firestore Timestamp objects
        createdAt = new Timestamp(
          createdAt.seconds,
          createdAt.nanoseconds
        ).toDate();
      } else if (!createdAt) {
        createdAt = new Date();
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });

    if (isLoadMore) {
      notifications.value = [...notifications.value, ...fetchedNotifications];
    } else {
      notifications.value = fetchedNotifications;
    }

    // Check if there might be more notifications
    hasMoreNotifications.value =
      fetchedNotifications.length === notificationsPerPage;

    // Store the last document for pagination
    lastFetchedNotification.value = snapshot.docs[snapshot.docs.length - 1];
  } catch (error) {
    console.error("Error fetching notifications:", error);
  } finally {
    loading.value = false;
  }
};

const loadMoreNotifications = () => {
  fetchNotifications(true);
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;

  if (showNotifications.value) {
    fetchNotifications();

    // Add click outside handler
    nextTick(() => {
      document.addEventListener("click", handleClickOutside);
    });
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
};

const handleClickOutside = (event) => {
  if (showNotifications.value) {
    const container = document.querySelector(".notifications-container");
    if (
      container &&
      !container.contains(event.target) &&
      !event.target
        .closest("button")
        ?.contains(document.querySelector(".notifications-container"))
    ) {
      showNotifications.value = false;
      document.removeEventListener("click", handleClickOutside);
    }
  }
};

const markAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: serverTimestamp(),
    });

    // Update local state
    const notificationIndex = notifications.value.findIndex(
      (n) => n.id === notificationId
    );
    if (notificationIndex !== -1) {
      notifications.value[notificationIndex].read = true;
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

const markAllAsRead = async () => {
  try {
    const unreadNotifications = notifications.value.filter((n) => !n.read);

    for (const notification of unreadNotifications) {
      const notificationRef = doc(db, "notifications", notification.id);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      });
    }

    // Update local state
    notifications.value.forEach((notification) => {
      notification.read = true;
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
  }
};

const handleNotificationClick = async (notification) => {
  // Mark as read
  if (!notification.read) {
    await markAsRead(notification.id);
  }

  // Handle navigation based on notification type
  if (
    (notification.type === "project_invitation" ||
      notification.type === "role_change") &&
    notification.projectId
  ) {
    router.push(`/projects?id=${notification.projectId}`);
  }

  // Close the notifications panel
  showNotifications.value = false;
};

const getNotificationIconClass = (type) => {
  switch (type) {
    case "project_invitation":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400";
    case "role_change":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400";
    case "removal":
      return "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
  }
};

const formatNotificationTime = (timestamp) => {
  if (!timestamp) return "";

  const date =
    timestamp instanceof Date
      ? timestamp
      : timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date);
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else if (diffMins > 0) {
    return `${diffMins}m ago`;
  } else {
    return "Just now";
  }
};
</script>
