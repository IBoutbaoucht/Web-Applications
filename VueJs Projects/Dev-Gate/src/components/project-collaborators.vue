<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Collaborators
      </h3>
      <button
        @click="showAddCollaboratorModal = true"
        class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md flex items-center"
      >
        <plus-icon class="h-4 w-4 mr-1" />
        Add Collaborator
      </button>
    </div>

    <div v-if="loading" class="py-4 flex justify-center">
      <loader-icon class="animate-spin h-6 w-6 text-indigo-600" />
    </div>

    <div
      v-else-if="collaborators.length === 0"
      class="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md"
    >
      <p>No collaborators yet</p>
      <button
        @click="showAddCollaboratorModal = true"
        class="mt-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm"
      >
        Add collaborators to this project
      </button>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="collaborator in collaborators"
        :key="collaborator.userId"
        class="flex items-center justify-between py-2"
      >
        <div class="flex items-center">
          <div
            class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
          >
            <img
              v-if="collaborator.photoURL"
              :src="collaborator.photoURL"
              class="h-full w-full object-cover"
              :alt="collaborator.displayName || collaborator.email"
            />
            <user-icon
              v-else
              class="h-full w-full p-1.5 text-gray-500 dark:text-gray-400"
            />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ collaborator.displayName || collaborator.email }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ collaborator.email }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <select
            v-if="isProjectOwner && collaborator.userId !== currentUserId"
            v-model="collaborator.role"
            @change="updateCollaboratorRole(collaborator)"
            class="mr-2 text-sm rounded-md border border-gray-300 bg-white px-2 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="admin">Admin</option>
          </select>
          <div v-else class="mr-2">
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="getRoleClass(collaborator.role)"
            >
              {{
                collaborator.role === "owner"
                  ? "Owner"
                  : collaborator.role === "admin"
                  ? "Admin"
                  : collaborator.role === "write"
                  ? "Write"
                  : "Read"
              }}
            </span>
          </div>
          <button
            v-if="isProjectOwner && collaborator.userId !== currentUserId"
            @click="removeCollaborator(collaborator)"
            class="text-gray-500 hover:text-red-600 dark:text-gray-400"
          >
            <trash-icon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add Collaborator Modal -->
    <div
      v-if="showAddCollaboratorModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Add Collaborator
          </h2>

          <form @submit.prevent="inviteCollaborator">
            <div class="mb-4">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                v-model="inviteEmail"
                type="email"
                required
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="collaborator@example.com"
              />
              <p v-if="emailError" class="mt-1 text-sm text-red-600">
                {{ emailError }}
              </p>
            </div>

            <div class="mb-6">
              <label
                for="role"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Permission Level
              </label>
              <select
                id="role"
                v-model="inviteRole"
                required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="read">Read (View only)</option>
                <option value="write">Write (Can make changes)</option>
                <option value="admin">
                  Admin (Full control except delete)
                </option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddCollaboratorModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="inviting"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <loader-icon v-if="inviting" class="animate-spin h-5 w-5" />
                <span v-else>Send Invitation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Remove Confirmation Modal -->
    <div
      v-if="showRemoveModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Remove Collaborator
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to remove
          <span class="font-semibold">{{ collaboratorToRemove?.email }}</span>
          from this project?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRemoveModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="confirmRemoveCollaborator"
            :disabled="removing"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <loader-icon v-if="removing" class="animate-spin h-5 w-5" />
            <span v-else>Remove</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  User as UserIcon,
  Plus as PlusIcon,
  Trash as TrashIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["collaborator-updated"]);

// State variables
const collaborators = ref([]);
const loading = ref(true);
const isProjectOwner = ref(false);
const currentUserId = ref("");
const showAddCollaboratorModal = ref(false);
const showRemoveModal = ref(false);
const inviteEmail = ref("");
const inviteRole = ref("read");
const inviting = ref(false);
const removing = ref(false);
const emailError = ref("");
const collaboratorToRemove = ref(null);

// Fetch collaborators on component mount
onMounted(async () => {
  if (auth.currentUser) {
    currentUserId.value = auth.currentUser.uid;
    isProjectOwner.value = props.ownerId === currentUserId.value;
    await fetchCollaborators();
  }
});

// Fetch collaborators for the current project
const fetchCollaborators = async () => {
  loading.value = true;
  try {
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", props.projectId)
    );

    const snapshot = await getDocs(collaboratorsQuery);

    const collabData = [];

    // Always add the owner
    const ownerData = {
      userId: props.ownerId,
      role: "owner",
      email: "",
      displayName: "",
      photoURL: null,
    };

    // Get user details for all collaborators
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      // Get the user details
      try {
        const userDoc = await getDoc(doc(db, "users", data.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          collabData.push({
            id: docSnap.id,
            userId: data.userId,
            role: data.role,
            email: userData.email || "",
            displayName: userData.displayName || "",
            photoURL: userData.photoURL || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Still add the collaborator even if we can't get their details
        collabData.push({
          id: docSnap.id,
          userId: data.userId,
          role: data.role,
          email: data.email || "",
          displayName: "",
          photoURL: null,
        });
      }
    }

    // Get owner details
    try {
      const ownerDoc = await getDoc(doc(db, "users", props.ownerId));
      if (ownerDoc.exists()) {
        const ownerUserData = ownerDoc.data();
        ownerData.email = ownerUserData.email || "";
        ownerData.displayName = ownerUserData.displayName || "";
        ownerData.photoURL = ownerUserData.photoURL || null;
      }
    } catch (error) {
      console.error("Error fetching owner details:", error);
    }

    // Make sure owner is first in the list
    collaborators.value = [
      ownerData,
      ...collabData.filter((c) => c.userId !== props.ownerId),
    ];
  } catch (error) {
    console.error("Error fetching collaborators:", error);
  } finally {
    loading.value = false;
  }
};

// Invite a collaborator to the project
const inviteCollaborator = async () => {
  if (!inviteEmail.value) return;

  inviting.value = true;
  emailError.value = "";

  try {
    // First, find the user with this email
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", inviteEmail.value.toLowerCase())
    );

    const userSnapshot = await getDocs(usersQuery);

    if (userSnapshot.empty) {
      emailError.value = "No user found with this email address";
      inviting.value = false;
      return;
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    // Check if this user is already a collaborator
    const existingCollabQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", props.projectId),
      where("userId", "==", userId)
    );

    const existingCollabSnapshot = await getDocs(existingCollabQuery);

    if (!existingCollabSnapshot.empty) {
      emailError.value = "This user is already a collaborator on this project";
      inviting.value = false;
      return;
    }

    // Add the collaborator
    await addDoc(collection(db, "projectCollaborators"), {
      projectId: props.projectId,
      userId: userId,
      role: inviteRole.value,
      addedAt: serverTimestamp(),
      addedBy: auth.currentUser.uid,
    });

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "collaboration",
      description: `Added ${
        userData.displayName || userData.email
      } as a collaborator to ${props.projectName}`,
      projectId: props.projectId,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Create a notification for the invited user
    await addDoc(collection(db, "notifications"), {
      userId: userId,
      type: "project_invitation",
      projectId: props.projectId,
      projectName: props.projectName,
      read: false,
      createdAt: serverTimestamp(),
      message: `You were added as a collaborator to ${props.projectName}`,
    });

    // Refresh the collaborators list
    await fetchCollaborators();

    // Reset form and close modal
    inviteEmail.value = "";
    inviteRole.value = "read";
    showAddCollaboratorModal.value = false;

    // Emit event that collaborators have been updated
    emit("collaborator-updated");
  } catch (error) {
    console.error("Error inviting collaborator:", error);
    emailError.value = "Failed to add collaborator. Please try again.";
  } finally {
    inviting.value = false;
  }
};

// Update a collaborator's role
const updateCollaboratorRole = async (collaborator) => {
  try {
    const collaboratorRef = doc(db, "projectCollaborators", collaborator.id);
    await updateDoc(collaboratorRef, {
      role: collaborator.role,
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser.uid,
    });

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "collaboration_update",
      description: `Updated ${
        collaborator.displayName || collaborator.email
      }'s role to ${collaborator.role} on ${props.projectName}`,
      projectId: props.projectId,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Create a notification for the user
    await addDoc(collection(db, "notifications"), {
      userId: collaborator.userId,
      type: "role_change",
      projectId: props.projectId,
      projectName: props.projectName,
      read: false,
      createdAt: serverTimestamp(),
      message: `Your role on ${props.projectName} was changed to ${collaborator.role}`,
    });

    // Emit event that collaborators have been updated
    emit("collaborator-updated");
  } catch (error) {
    console.error("Error updating collaborator role:", error);
  }
};

// Remove a collaborator
const removeCollaborator = (collaborator) => {
  collaboratorToRemove.value = collaborator;
  showRemoveModal.value = true;
};

// Confirm removal of a collaborator
const confirmRemoveCollaborator = async () => {
  if (!collaboratorToRemove.value) return;

  removing.value = true;
  try {
    const collaboratorRef = doc(
      db,
      "projectCollaborators",
      collaboratorToRemove.value.id
    );
    await deleteDoc(collaboratorRef);

    // Add an activity record
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "collaboration_remove",
      description: `Removed ${
        collaboratorToRemove.value.displayName ||
        collaboratorToRemove.value.email
      } from ${props.projectName}`,
      projectId: props.projectId,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Create a notification for the user
    await addDoc(collection(db, "notifications"), {
      userId: collaboratorToRemove.value.userId,
      type: "removal",
      projectId: props.projectId,
      projectName: props.projectName,
      read: false,
      createdAt: serverTimestamp(),
      message: `You were removed from the project ${props.projectName}`,
    });

    // Refresh the collaborators list
    await fetchCollaborators();

    // Reset and close modal
    showRemoveModal.value = false;
    collaboratorToRemove.value = null;

    // Emit event that collaborators have been updated
    emit("collaborator-updated");
  } catch (error) {
    console.error("Error removing collaborator:", error);
  } finally {
    removing.value = false;
  }
};

// Get CSS class for role badge
const getRoleClass = (role) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "admin":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "write":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "read":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};
</script>
