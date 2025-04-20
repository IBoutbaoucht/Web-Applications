/* eslint-disable */
<template>
  <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Group Header -->
    <div
      class="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between"
    >
      <div v-if="group" class="flex items-center">
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
        <div class="flex flex-col">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            {{ group.name }}
          </h2>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ group.members.length }} members
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none"
          @click="showMembersModal = true"
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </button>
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
          <!-- Author name for group chats -->
          <div
            v-if="!isOwnMessage(message)"
            class="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-2"
          >
            {{ getMemberName(message.authorId) }}
          </div>

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
    </div>

    <!-- Message Input -->
    <div class="bg-white dark:bg-gray-800 p-4 border-t dark:border-gray-700">
      <div class="flex items-center">
        <textarea
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
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

    <!-- Members Modal -->
    <div
      v-if="showMembersModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Group Members
          </h3>
          <button
            @click="showMembersModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div
            v-for="member in members"
            :key="member.uid"
            class="flex items-center p-3 border-b dark:border-gray-700 last:border-0"
          >
            <AvatarComponent :user="member" size="sm" :showStatus="true" />
            <div class="ml-3 flex-1">
              <div class="font-medium text-gray-800 dark:text-white">
                {{ member.name || member.email }}
              </div>
              <div
                class="text-sm text-gray-500 dark:text-gray-400 flex items-center"
              >
                <span
                  :class="{
                    'bg-green-500': member.status === 'online',
                    'bg-yellow-500': member.status === 'away',
                    'bg-gray-500':
                      member.status === 'offline' || !member.status,
                  }"
                  class="w-2 h-2 rounded-full mr-2"
                ></span>
                {{ member.status || "Offline" }}
              </div>
            </div>
            <div
              v-if="isGroupAdmin && member.uid !== currentUser.uid"
              class="ml-auto"
            >
              <button
                @click="removeMember(member.uid)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase";
import { showToast } from "@/utils/toast";
import { createNotification } from "@/utils/notifications";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default {
  components: { AvatarComponent },
  props: {
    groupId: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const currentUser = store.state.user;

    const group = ref(null);
    const messages = ref([]);
    const newMessage = ref("");
    const messageList = ref(null);
    const editingMessage = ref(null);
    const editedMessageContent = ref("");
    const error = ref("");
    const members = ref([]);
    const showMembersModal = ref(false);

    let unsubscribeGroup = null;
    let unsubscribeMessages = null;

    const groupId = computed(() => props.groupId || route.params.groupId);

    const isGroupAdmin = computed(() => {
      return group.value && group.value.admin === currentUser.uid;
    });

    const loadGroup = async () => {
      try {
        if (!groupId.value || !currentUser) {
          throw new Error("Invalid group ID or user not authenticated");
        }
        const groupDoc = await getDoc(doc(db, "groups", groupId.value));
        if (groupDoc.exists()) {
          group.value = { id: groupDoc.id, ...groupDoc.data() };
          await loadMembers();
          unsubscribeGroup = onSnapshot(
            doc(db, "groups", groupId.value),
            (doc) => {
              if (doc.exists()) {
                group.value = { id: doc.id, ...doc.data() };
                loadMembers();
              }
            },
            (err) => {
              console.error("Group listener error:", err);
              error.value =
                err.code === "permission-denied"
                  ? "You do not have permission to access this group."
                  : "Failed to update group data.";
            }
          );
        } else {
          throw new Error("Group not found");
        }
      } catch (err) {
        console.error("Error loading group:", err);
        error.value =
          err.code === "permission-denied"
            ? "You do not have permission to access this group."
            : "Failed to load group. Please try again.";
        showToast(error.value, "error");
      }
    };

    const loadMembers = async () => {
      try {
        if (!group.value?.members) return;
        const memberPromises = group.value.members.map((uid) =>
          getDoc(doc(db, "users", uid))
        );
        const memberDocs = await Promise.all(memberPromises);
        members.value = memberDocs
          .filter((doc) => doc.exists())
          .map((doc) => ({ uid: doc.id, ...doc.data() }));
      } catch (err) {
        console.error("Error loading members:", err);
        showToast("Failed to load group members", "error");
      }
    };

    const setupListeners = () => {
      if (!groupId.value || !group.value) return;

      const messagesRef = collection(db, "groups", groupId.value, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      unsubscribeMessages = onSnapshot(
        messagesQuery,
        (snapshot) => {
          messages.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          nextTick(() => scrollToBottom());
        },
        (err) => {
          console.error("Messages listener error:", err);
          error.value =
            err.code === "permission-denied"
              ? "You do not have permission to access group messages."
              : "Failed to load messages.";
          showToast(error.value, "error");
        }
      );
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        const messageData = {
          authorId: currentUser.uid,
          content: newMessage.value.trim(),
          timestamp: serverTimestamp(),
        };

        const messageRef = await addDoc(
          collection(db, "groups", groupId.value, "messages"),
          messageData
        );

        // Create notifications for all group members except the sender
        if (group.value && group.value.members) {
          for (const memberId of group.value.members) {
            if (memberId !== currentUser.uid) {
              await createNotification(
                memberId,
                `New message in ${group.value.name}`,
                `${getMemberName(currentUser.uid)}: ${newMessage.value.trim()}`,
                groupId.value
              );
            }
          }
        }

        newMessage.value = "";
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
        error.value =
          error.code === "permission-denied"
            ? "You do not have permission to send messages in this group."
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
          doc(db, "groups", groupId.value, "messages", editingMessage.value.id),
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
            doc(db, "groups", groupId.value, "messages", messageId)
          );
          showToast("Message deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting message:", error);
          showToast("Failed to delete message", "error");
        }
      }
    };

    const removeMember = async (memberId) => {
      if (!isGroupAdmin.value) {
        showToast("Only group admin can remove members", "error");
        return;
      }

      if (
        confirm("Are you sure you want to remove this member from the group?")
      ) {
        try {
          await updateDoc(doc(db, "groups", groupId.value), {
            members: arrayRemove(memberId),
          });
          showToast("Member removed successfully", "success");
        } catch (error) {
          console.error("Error removing member:", error);
          showToast("Failed to remove member", "error");
        }
      }
    };

    const isOwnMessage = (message) => {
      // Allow message author to edit/delete their own messages
      if (message.authorId === currentUser.uid) return true;

      // Allow group admin to delete any message
      if (group.value && group.value.admin === currentUser.uid) return true;

      return false;
    };

    const getMemberName = (uid) => {
      const member = members.value.find((m) => m.uid === uid);
      return member ? member.name || member.email : "Unknown";
    };

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

    onMounted(async () => {
      console.log("Mounting GroupChat with groupId:", groupId.value);
      await loadGroup();
      setupListeners();
    });

    onBeforeUnmount(() => {
      if (unsubscribeGroup) unsubscribeGroup();
      if (unsubscribeMessages) unsubscribeMessages();
    });

    return {
      group,
      messages,
      newMessage,
      messageList,
      editingMessage,
      editedMessageContent,
      error,
      members,
      showMembersModal,
      sendMessage,
      editMessage,
      saveEditedMessage,
      cancelEditing,
      deleteMessage,
      removeMember,
      isOwnMessage,
      getMemberName,
      formatTime,
      isGroupAdmin,
      currentUser,
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

/* Adjust textarea to auto-expand (optional enhancement) */
textarea {
  min-height: 40px;
  max-height: 120px;
}
</style>
