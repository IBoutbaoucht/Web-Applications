<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Chat Header -->
    <div
      class="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between"
    >
      <div v-if="recipient" class="flex items-center">
        <router-link
          to="/"
          class="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </router-link>
        <div class="relative">
          <AvatarComponent :user="recipient" size="md" :showStatus="true" />
        </div>
        <div class="ml-3">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ recipient.name || recipient.email }}
          </h2>
          <div class="flex items-center">
            <span
              :class="{
                'bg-green-500': recipient.status === 'online',
                'bg-yellow-500': recipient.status === 'away',
                'bg-gray-500':
                  recipient.status === 'offline' || !recipient.status,
              }"
              class="w-2 h-2 rounded-full mr-2"
            ></span>
            <span class="text-sm text-gray-600 dark:text-gray-300">
              {{
                recipient.status === "online"
                  ? "Online"
                  : recipient.status === "away"
                  ? "Away"
                  : "Offline"
              }}
              <span v-if="recipient.status !== 'online' && recipient.lastSeen">
                • Last seen {{ formatLastSeen(recipient.lastSeen) }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <!-- Add any header actions here (call, video, etc.) -->
      </div>
    </div>

    <!-- Chat Messages -->
    <div
      ref="messageList"
      class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-900"
    >
      <div
        v-if="error"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 dark:bg-red-900 dark:text-red-200"
      >
        <p>{{ error }}</p>
      </div>

      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="text-center">No messages yet. Start the conversation!</p>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        class="message-container"
      >
        <div
          :class="{
            'flex flex-col': true,
            'items-end': isOwnMessage(message),
            'items-start': !isOwnMessage(message),
          }"
        >
          <!-- Message bubble -->
          <div
            :class="{
              'max-w-[75%] rounded-lg p-3 mb-1': true,
              'bg-blue-500 text-white':
                (isOwnMessage(message) && !editingMessage) ||
                editingMessage?.id !== message.id,
              'bg-white dark:bg-gray-800 text-gray-800 dark:text-white':
                !isOwnMessage(message),
              'bg-gray-200 dark:bg-gray-700': editingMessage?.id === message.id,
            }"
          >
            <!-- Editing interface -->
            <div v-if="editingMessage?.id === message.id" class="flex flex-col">
              <textarea
                v-model="editedMessageContent"
                class="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows="3"
              ></textarea>
              <div class="flex justify-end space-x-2">
                <button
                  @click="cancelEditing"
                  class="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  @click="saveEditedMessage"
                  class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>

            <!-- Message content -->
            <div v-else>
              <p class="whitespace-pre-wrap break-words">
                {{ message.content }}
              </p>
              <div v-if="message.edited" class="text-xs opacity-70 mt-1">
                (edited)
              </div>
            </div>
          </div>

          <!-- Message metadata -->
          <div
            class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            <span>{{ formatTime(message.timestamp) }}</span>
            <span
              v-if="isOwnMessage(message) && message.read"
              class="text-blue-500 dark:text-blue-400"
              >Read</span
            >

            <!-- Message actions -->
            <div
              v-if="isOwnMessage(message) && !editingMessage"
              class="flex space-x-2"
            >
              <button
                @click="editMessage(message)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="deleteMessage(message.id)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div
        v-if="isTyping"
        class="flex items-center text-gray-500 dark:text-gray-400"
      >
        <span class="text-sm italic"
          >{{ recipient?.name || "User" }} is typing</span
        >
        <div class="flex ml-2">
          <div
            class="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
          ></div>
          <div
            class="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-100 mx-1"
          ></div>
          <div
            class="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-200"
          ></div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
      <div class="flex items-center">
        <textarea
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
          @input="handleTyping"
          placeholder="Type a message..."
          class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          rows="1"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          :class="{
            'ml-3 p-3 rounded-full focus:outline-none': true,
            'bg-blue-500 text-white hover:bg-blue-600': newMessage.trim(),
            'bg-gray-300 text-gray-500 cursor-not-allowed': !newMessage.trim(),
          }"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import AvatarComponent from "@/components/AvatarComponent.vue";
import * as Notifications from "@/utils/notifications";
import { showToast } from "@/utils/toast";
import { createNotification } from "@/utils/notifications";

export default {
  components: { AvatarComponent },
  props: {
    chatId: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const currentUser = store.state.user;

    const chatId = ref(props.chatId || route.params.chatId);
    const recipient = ref(null);
    const messages = ref([]);
    const newMessage = ref("");
    const isTyping = ref(false);
    const typingTimeout = ref(null);
    const messageList = ref(null);
    const editingMessage = ref(null);
    const editedMessageContent = ref("");
    const error = ref("");

    let unsubscribeMessages = null;
    let unsubscribeTyping = null;
    let unsubscribeRecipient = null;

    const loadRecipient = async () => {
      try {
        if (!chatId.value || !currentUser) {
          throw new Error("Invalid chat ID or user not authenticated");
        }
        const recipientId = chatId.value
          .split("_")
          .find((id) => id !== currentUser.uid);
        if (!recipientId) {
          throw new Error("Recipient ID not found in chat ID");
        }
        const userDoc = await getDoc(doc(db, "users", recipientId));
        if (userDoc.exists()) {
          recipient.value = { uid: recipientId, ...userDoc.data() };
          unsubscribeRecipient = onSnapshot(
            doc(db, "users", recipientId),
            (doc) => {
              if (doc.exists()) {
                recipient.value = { uid: recipientId, ...doc.data() };
              }
            },
            (err) => {
              console.error("Recipient listener error:", err);
              error.value = "Failed to update recipient status.";
            }
          );
        } else {
          throw new Error("Recipient not found");
        }
      } catch (err) {
        console.error("Error loading recipient:", err);
        error.value =
          err.code === "permission-denied"
            ? "You do not have permission to access this chat."
            : "Failed to load chat. Please try again.";
        showToast(error.value, "error");
      }
    };

    const setupListeners = () => {
      if (!chatId.value || !recipient.value) return;

      const messagesRef = collection(db, "chats", chatId.value, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      unsubscribeMessages = onSnapshot(
        messagesQuery,
        (snapshot) => {
          messages.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          nextTick(() => {
            scrollToBottom();
            markMessagesAsRead();
          });
        },
        (err) => {
          console.error("Messages listener error:", err);
          error.value =
            err.code === "permission-denied"
              ? "You do not have permission to access this chat."
              : "Failed to load messages.";
          showToast(error.value, "error");
        }
      );

      const typingRef = doc(
        db,
        "chats",
        chatId.value,
        "typing",
        recipient.value.uid
      );
      unsubscribeTyping = onSnapshot(
        typingRef,
        (doc) => {
          isTyping.value = doc.exists() && doc.data().typing;
        },
        (err) => {
          console.error("Typing listener error:", err);
        }
      );
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        const chatRef = doc(db, "chats", chatId.value);
        await setDoc(
          chatRef,
          { participants: chatId.value.split("_") },
          { merge: true }
        );

        const messageData = {
          senderId: currentUser.uid,
          content: newMessage.value.trim(),
          timestamp: serverTimestamp(),
          read: false,
        };

        await addDoc(
          collection(db, "chats", chatId.value, "messages"),
          messageData
        );

        // Create notification for recipient
        if (recipient.value) {
          await createNotification(
            recipient.value.uid,
            `New message from ${currentUser.displayName || currentUser.email}`,
            newMessage.value.trim(),
            chatId.value
          );
        }

        newMessage.value = "";
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
        error.value =
          error.code === "permission-denied"
            ? "You do not have permission to send messages in this chat."
            : "Failed to send message.";
        showToast(error.value, "error");
      }
    };

    const editMessage = (msg) => {
      editingMessage.value = msg;
      editedMessageContent.value = msg.content;
    };

    const saveEditedMessage = async () => {
      if (!editedMessageContent.value.trim()) return;

      try {
        await updateDoc(
          doc(db, "chats", chatId.value, "messages", editingMessage.value.id),
          {
            content: editedMessageContent.value.trim(),
            edited: true,
          }
        );
        editingMessage.value = null;
        editedMessageContent.value = "";
        showToast("Message updated successfully", "success");
      } catch (error) {
        console.error("Error updating message:", error);
        showToast("Failed to update message", "error");
      }
    };

    const cancelEditing = () => {
      editingMessage.value = null;
      editedMessageContent.value = "";
    };

    const deleteMessage = async (messageId) => {
      if (confirm("Are you sure you want to delete this message?")) {
        try {
          await deleteDoc(
            doc(db, "chats", chatId.value, "messages", messageId)
          );
          showToast("Message deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting message:", error);
          showToast("Failed to delete message", "error");
        }
      }
    };

    const handleTyping = async () => {
      if (!chatId.value) return;

      clearTimeout(typingTimeout.value);
      const typingRef = doc(
        db,
        "chats",
        chatId.value,
        "typing",
        currentUser.uid
      );
      await setDoc(
        typingRef,
        { typing: true, timestamp: new Date() },
        { merge: true }
      );

      typingTimeout.value = setTimeout(() => {
        setDoc(typingRef, { typing: false }, { merge: true });
      }, 1500);
    };

    const markMessagesAsRead = async () => {
      const unreadMessages = messages.value.filter(
        (msg) => !msg.read && msg.senderId !== currentUser.uid
      );
      for (const msg of unreadMessages) {
        await updateDoc(doc(db, "chats", chatId.value, "messages", msg.id), {
          read: true,
        });
      }
    };

    const isOwnMessage = (message) => message.senderId === currentUser.uid;

    const scrollToBottom = () => {
      if (messageList.value) {
        messageList.value.scrollTop = messageList.value.scrollHeight;
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatLastSeen = (timestamp) => {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString([], {
        dateStyle: "short",
        timeStyle: "short",
      });
    };

    onMounted(async () => {
      console.log("Mounting PrivateChat with chatId:", chatId.value);
      await Notifications.initializeNotifications((payload) => {
        if (payload.data.chatId !== chatId.value) {
          Notifications.showLocalNotification(payload.notification.title, {
            body: payload.notification.body,
            data: { chatId: payload.data.chatId },
          });
        }
      });
      await loadRecipient();
      setupListeners();
    });

    onBeforeUnmount(() => {
      if (unsubscribeMessages) unsubscribeMessages();
      if (unsubscribeTyping) unsubscribeTyping();
      if (unsubscribeRecipient) unsubscribeRecipient();
      if (typingTimeout.value) clearTimeout(typingTimeout.value);
    });

    return {
      chatId,
      recipient,
      messages,
      newMessage,
      isTyping,
      messageList,
      editingMessage,
      editedMessageContent,
      error,
      sendMessage,
      editMessage,
      saveEditedMessage,
      cancelEditing,
      deleteMessage,
      handleTyping,
      isOwnMessage,
      formatTime,
      formatLastSeen,
    };
  },
};
</script>

<style scoped>
.message-container {
  margin-bottom: 12px;
}

/* Ensure the message list takes up available space */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* Animate typing indicator */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

/* Adjust textarea to auto-expand (optional enhancement) */
textarea {
  min-height: 40px;
  max-height: 120px;
}
</style>
