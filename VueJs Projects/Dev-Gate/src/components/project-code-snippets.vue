<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
        Code Snippets
      </h3>
      <button
        v-if="canAddSnippets"
        @click="showAddSnippetModal = true"
        class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md flex items-center"
      >
        <plus-icon class="h-4 w-4 mr-1" />
        Add Snippet
      </button>
    </div>

    <div v-if="loading" class="py-4 flex justify-center">
      <loader-icon class="animate-spin h-6 w-6 text-indigo-600" />
    </div>

    <div
      v-else-if="snippets.length === 0"
      class="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md"
    >
      <code-icon class="h-8 w-8 mx-auto text-gray-400 mb-2" />
      <p>No code snippets yet</p>
      <button
        v-if="canAddSnippets"
        @click="showAddSnippetModal = true"
        class="mt-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm"
      >
        Add your first code snippet
      </button>
    </div>

    <div v-else class="space-y-4">
      <code-snippet
        v-for="snippet in snippets"
        :key="snippet.id"
        :snippet="snippet"
        :can-edit="canEditSnippet(snippet)"
        @edit="editSnippet"
        @delete="confirmDeleteSnippet"
      />
    </div>

    <!-- Add/Edit Snippet Modal -->
    <div
      v-if="showAddSnippetModal || showEditSnippetModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full"
      >
        <code-snippet-form
          :snippet="editingSnippet"
          :saving="saving"
          @save="saveSnippet"
          @cancel="cancelSnippetModal"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Delete Code Snippet
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete
          <span class="font-semibold">{{ snippetToDelete?.title }}</span
          >? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="deleteSnippet"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <loader-icon v-if="deleting" class="animate-spin h-5 w-5" />
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";
import { auth } from "../firebase";
import {
  getProjectCodeSnippets,
  addCodeSnippet,
  updateCodeSnippet,
  deleteCodeSnippet as deleteCodeSnippetApi,
} from "../firebase/code-snippets";
import { userCanEditProject } from "../firebase/collaborations";
import CodeSnippet from "./code-snippet.vue";
import CodeSnippetForm from "./code-snippet-form.vue";
import {
  Code as CodeIcon,
  Plus as PlusIcon,
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

// State variables
const snippets = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const showAddSnippetModal = ref(false);
const showEditSnippetModal = ref(false);
const showDeleteModal = ref(false);
const editingSnippet = ref({});
const snippetToDelete = ref(null);
const canAddSnippets = ref(false);

// Computed properties
const currentUserId = computed(() => auth.currentUser?.uid || "");
const isProjectOwner = computed(() => props.ownerId === currentUserId.value);

// Lifecycle hooks
onMounted(async () => {
  if (auth.currentUser) {
    await fetchSnippets();
    checkPermissions();
  }
});

// Methods
const fetchSnippets = async () => {
  loading.value = true;
  try {
    snippets.value = await getProjectCodeSnippets(props.projectId);
  } catch (error) {
    console.error("Error fetching code snippets:", error);
  } finally {
    loading.value = false;
  }
};

const checkPermissions = async () => {
  try {
    canAddSnippets.value = await userCanEditProject(
      props.projectId,
      currentUserId.value
    );
  } catch (error) {
    console.error("Error checking permissions:", error);
    canAddSnippets.value = false;
  }
};

const canEditSnippet = (snippet) => {
  // User can edit if they are the project owner, have edit permissions, or created the snippet
  return (
    isProjectOwner.value ||
    canAddSnippets.value ||
    snippet.userId === currentUserId.value
  );
};

const editSnippet = (snippet) => {
  editingSnippet.value = { ...snippet };
  showEditSnippetModal.value = true;
};

const confirmDeleteSnippet = (snippet) => {
  snippetToDelete.value = snippet;
  showDeleteModal.value = true;
};

const saveSnippet = async (snippetData) => {
  saving.value = true;
  try {
    if (snippetData.id) {
      // Update existing snippet
      await updateCodeSnippet(snippetData.id, snippetData);
    } else {
      // Add new snippet
      await addCodeSnippet(props.projectId, snippetData);
    }

    // Refresh snippets list
    await fetchSnippets();

    // Close modal
    cancelSnippetModal();
  } catch (error) {
    console.error("Error saving code snippet:", error);
    alert(error.message);
  } finally {
    saving.value = false;
  }
};

const deleteSnippet = async () => {
  if (!snippetToDelete.value) return;

  deleting.value = true;
  try {
    await deleteCodeSnippetApi(snippetToDelete.value.id);

    // Refresh snippets list
    await fetchSnippets();

    // Close modal
    showDeleteModal.value = false;
    snippetToDelete.value = null;
  } catch (error) {
    console.error("Error deleting code snippet:", error);
    alert(error.message);
  } finally {
    deleting.value = false;
  }
};

const cancelSnippetModal = () => {
  showAddSnippetModal.value = false;
  showEditSnippetModal.value = false;
  editingSnippet.value = {};
};
</script>
