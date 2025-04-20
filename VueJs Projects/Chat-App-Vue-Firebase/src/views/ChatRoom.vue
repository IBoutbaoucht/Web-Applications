/* eslint-disable */
<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left Sidebar: User List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Contacts
          </h2>
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="filterUsers"
              type="text"
              placeholder="Search users..."
              class="w-full p-2 pl-8 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div class="overflow-y-auto max-h-96">
          <div
            v-if="filteredUsers.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-4"
          >
            No users found
          </div>
          <div
            v-for="user in filteredUsers"
            :key="user.uid"
            @click="openChat(user)"
            class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
          >
            <AvatarComponent :user="user" size="md" :showStatus="true" />
            <div class="ml-3">
              <div class="font-medium text-gray-800 dark:text-white">
                {{ user.name || user.email }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ user.status || "Offline" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle: Group List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            Groups
          </h2>
          <button
            @click="showCreateGroupModal = true"
            class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Create Group
          </button>
        </div>

        <div class="overflow-y-auto max-h-96">
          <div
            v-if="filteredGroups.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 py-4"
          >
            No groups found
          </div>
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="p-3 border-b dark:border-gray-700 last:border-0"
          >
            <div class="flex justify-between items-center">
              <div
                @click="goToGroup(group.id)"
                class="flex-1 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
              >
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ group.name }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ group.members.length }} members
                </div>
              </div>
              <button
                v-if="isGroupCreator(group)"
                @click="confirmDeleteGroup(group.id)"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: User Profile -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <AvatarComponent
              :user="currentUser || { uid: '', email: '' }"
              size="lg"
              :showStatus="false"
            />
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {{ currentUser?.displayName || currentUser?.email || "User" }}
          </h2>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div class="flex items-center justify-center">
              <span class="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
              <span>Online</span>
            </div>
          </div>
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Create Group Modal -->
    <div
      v-if="showCreateGroupModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Create New Group
        </h3>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2"
            >Group Name</label
          >
          <input
            v-model="newGroupName"
            type="text"
            class="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter group name"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 mb-2"
            >Select Members</label
          >
          <div
            class="max-h-48 overflow-y-auto border rounded-md p-2 dark:border-gray-600"
          >
            <div
              v-for="user in users"
              :key="user.uid"
              class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                :id="user.uid"
                :value="user.uid"
                v-model="selectedMembers"
                class="mr-2"
              />
              <label :for="user.uid" class="flex items-center cursor-pointer">
                <AvatarComponent :user="user" size="sm" :showStatus="false" />
                <span class="ml-2 text-gray-800 dark:text-white">
                  {{ user.name || user.email }}
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="cancelGroupCreation"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="createGroup"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AvatarComponent from "@/components/AvatarComponent.vue";
import { showToast } from "@/utils/toast";

export default {
  components: { AvatarComponent },
  setup() {
    const router = useRouter();
    const users = ref([]);
    const filteredUsers = ref([]);
    const groups = ref([]);
    const currentUser = ref(null);
    const showCreateGroupModal = ref(false);
    const newGroupName = ref("");
    const selectedMembers = ref([]);
    const searchQuery = ref("");

    const filteredGroups = computed(() => {
      return groups.value.filter((group) =>
        group.members.includes(currentUser.value?.uid)
      );
    });

    const filterUsers = () => {
      if (!searchQuery.value) {
        filteredUsers.value = users.value;
        return;
      }
      const query = searchQuery.value.toLowerCase();
      filteredUsers.value = users.value.filter(
        (user) =>
          (user.name || "").toLowerCase().includes(query) ||
          (user.email || "").toLowerCase().includes(query)
      );
    };

    const createGroup = async () => {
      if (!newGroupName.value.trim()) {
        showToast("Please enter a group name", "error");
        return;
      }

      if (selectedMembers.value.length === 0) {
        showToast("Please select at least one member", "error");
        return;
      }

      try {
        const members = [...selectedMembers.value, currentUser.value.uid];
        await addDoc(collection(db, "groups"), {
          name: newGroupName.value,
          createdBy: currentUser.value.uid,
          createdAt: new Date(),
          members,
          admin: currentUser.value.uid,
        });
        showToast("Group created successfully", "success");
        resetGroupCreation();
      } catch (error) {
        console.error("Error creating group:", error);
        showToast("Failed to create group", "error");
      }
    };

    const confirmDeleteGroup = async (groupId) => {
      if (confirm("Are you sure you want to delete this group?")) {
        try {
          const group = groups.value.find((g) => g.id === groupId);

          if (!group) {
            showToast("Group not found", "error");
            return;
          }

          if (group.createdBy !== currentUser.value.uid) {
            showToast(
              "You don't have permission to delete this group",
              "error"
            );
            return;
          }

          await deleteDoc(doc(db, "groups", groupId));
          showToast("Group deleted successfully", "success");
        } catch (error) {
          console.error("Error deleting group:", error);
          showToast("Failed to delete group", "error");
        }
      }
    };

    const resetGroupCreation = () => {
      newGroupName.value = "";
      selectedMembers.value = [];
      showCreateGroupModal.value = false;
    };

    const cancelGroupCreation = () => {
      resetGroupCreation();
    };

    const getChatId = (user1, user2) => {
      return [user1.uid, user2.uid].sort().join("_");
    };

    const openChat = (user) => {
      const chatId = getChatId(currentUser.value, user);
      router.push({
        name: "PrivateChat",
        params: { chatId },
      });
    };

    const goToGroup = (groupId) => {
      router.push({ name: "GroupChat", params: { groupId } });
    };

    const logout = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          await updateUserStatus(user.uid, "offline");
        }

        await signOut(auth);
        router.push("/login");
        showToast("Logged out successfully", "success");
      } catch (error) {
        console.error("Logout error:", error);
        showToast("Failed to logout", "error");
      }
    };

    const updateUserStatus = async (uid, status) => {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(
          userRef,
          { status, lastSeen: new Date() },
          { merge: true }
        );
      } catch (error) {
        console.error("Status update error:", error);
      }
    };

    const setupUserListeners = () => {
      try {
        onSnapshot(collection(db, "users"), (snapshot) => {
          users.value = snapshot.docs
            .map((doc) => ({
              uid: doc.id,
              ...doc.data(),
              status: doc.data().status || "offline",
            }))
            .filter((u) => u.uid !== currentUser.value?.uid);
          filteredUsers.value = users.value;
        });

        onSnapshot(collection(db, "groups"), (snapshot) => {
          groups.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });
      } catch (error) {
        console.error("Listener setup error:", error);
      }
    };

    const isGroupCreator = (group) => {
      return group.createdBy === currentUser.value?.uid;
    };

    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          currentUser.value = user;
          setupUserListeners();
          updateUserStatus(user.uid, "online");
        }
      });
    });

    return {
      users,
      filteredUsers,
      groups,
      filteredGroups,
      currentUser,
      showCreateGroupModal,
      newGroupName,
      selectedMembers,
      searchQuery,
      filterUsers,
      createGroup,
      confirmDeleteGroup,
      resetGroupCreation,
      cancelGroupCreation,
      getChatId,
      openChat,
      goToGroup,
      logout,
      isGroupCreator,
    };
  },
};
</script>
