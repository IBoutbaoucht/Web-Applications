<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Technical Objectives
      </h1>
      <button
        @click="showAddObjectiveModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Objective
      </button>
    </div>

    <!-- Objectives Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1">
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Search</label
          >
          <div class="relative">
            <search-icon
              class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            />
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Search objectives..."
              class="pl-10 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div class="w-full md:w-48">
          <label
            for="status-filter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Status</label
          >
          <select
            id="status-filter"
            v-model="statusFilter"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div class="w-full md:w-48">
          <label
            for="sort-by"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Sort By</label
          >
          <select
            id="sort-by"
            v-model="sortBy"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="progress">Progress</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Objectives List -->
    <div v-if="loading" class="flex justify-center py-12">
      <loader-icon class="animate-spin h-12 w-12 text-indigo-600" />
    </div>

    <div
      v-else-if="filteredObjectives.length === 0"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
    >
      <target-icon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No objectives found
      </h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          objectives.length === 0
            ? "You haven't added any objectives yet."
            : "No objectives match your current filters."
        }}
      </p>
      <button
        v-if="objectives.length === 0"
        @click="showAddObjectiveModal = true"
        class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Your First Objective
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="objective in filteredObjectives"
        :key="objective.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="objective.status === 'Completed'"
                @change="toggleObjectiveStatus(objective)"
                class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <h3
                class="ml-3 text-lg font-semibold"
                :class="
                  objective.status === 'Completed'
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-white'
                "
              >
                {{ objective.title }}
              </h3>
              <span
                class="ml-3 text-xs px-2 py-1 rounded-full"
                :class="getStatusClass(objective.status)"
              >
                {{ objective.status }}
              </span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="editObjective(objective)"
                class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
              >
                <edit-icon class="h-5 w-5" />
              </button>
              <button
                @click="confirmDeleteObjective(objective)"
                class="text-gray-500 hover:text-red-600 dark:text-gray-400"
              >
                <trash-icon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ objective.description }}
            </p>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >Progress</span
              >
              <span
                class="text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {{ objective.progress }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full"
                :style="{ width: `${objective.progress}%` }"
              ></div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-4">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Created
              </div>
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ formatDate(objective.createdAt) }}
              </div>
            </div>
            <div v-if="objective.deadline">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Deadline
              </div>
              <div
                class="text-sm font-medium"
                :class="
                  isOverdue(objective)
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
                "
              >
                {{ formatDate(objective.deadline) }}
                <span v-if="isOverdue(objective)" class="text-xs ml-1"
                  >(Overdue)</span
                >
              </div>
            </div>
            <div v-if="objective.completedAt">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Completed
              </div>
              <div
                class="text-sm font-medium text-green-600 dark:text-green-400"
              >
                {{ formatDate(objective.completedAt) }}
              </div>
            </div>
          </div>

          <div
            v-if="objective.relatedSkills && objective.relatedSkills.length > 0"
            class="mt-4"
          >
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Related Skills
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(skill, index) in objective.relatedSkills"
                :key="index"
                class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Progress Update Button -->
          <div v-if="objective.status !== 'Completed'" class="mt-4">
            <button
              @click="showProgressModal(objective)"
              class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm flex items-center"
            >
              <plus-circle-icon class="h-4 w-4 mr-1" />
              Update Progress
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Objective Modal -->
    <div
      v-if="showAddObjectiveModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ editingObjective ? "Edit Objective" : "Add New Objective" }}
          </h2>

          <form @submit.prevent="saveObjective">
            <div class="mb-4">
              <label
                for="objective-title"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Objective Title
              </label>
              <input
                id="objective-title"
                v-model="objectiveForm.title"
                type="text"
                required
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g. Learn TypeScript in 30 days"
              />
            </div>

            <div class="mb-4">
              <label
                for="objective-description"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="objective-description"
                v-model="objectiveForm.description"
                rows="3"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe your objective..."
              ></textarea>
            </div>

            <div class="mb-4">
              <label
                for="objective-status"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="objective-status"
                v-model="objectiveForm.status"
                required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div class="mb-4">
              <label
                for="objective-progress"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Progress ({{ objectiveForm.progress }}%)
              </label>
              <input
                id="objective-progress"
                v-model="objectiveForm.progress"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div class="mb-4">
              <label
                for="objective-deadline"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Deadline (Optional)
              </label>
              <input
                id="objective-deadline"
                v-model="objectiveForm.deadline"
                type="date"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="mb-6">
              <label
                for="objective-skills"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Related Skills (Optional)
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="(skill, index) in objectiveForm.relatedSkills"
                  :key="index"
                  class="flex items-center bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ skill }}
                  <button
                    type="button"
                    @click="removeRelatedSkill(index)"
                    class="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                  >
                    <x-icon class="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div class="flex">
                <input
                  id="objective-skills"
                  v-model="newSkill"
                  type="text"
                  class="block w-full rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. JavaScript, React"
                  @keydown.enter.prevent="addRelatedSkill"
                />
                <button
                  type="button"
                  @click="addRelatedSkill"
                  class="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddObjectiveModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <loader-icon v-if="saving" class="animate-spin h-5 w-5" />
                <span v-else>{{ editingObjective ? "Update" : "Save" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Progress Update Modal -->
    <div
      v-if="showProgressUpdateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Update Progress
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Update your progress for
          <span class="font-semibold">{{ objectiveToUpdate?.title }}</span>
        </p>

        <div class="mb-4">
          <label
            for="progress-update"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Progress ({{ progressValue }}%)
          </label>
          <input
            id="progress-update"
            v-model="progressValue"
            type="range"
            min="0"
            max="100"
            step="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>

        <div class="mb-4">
          <label
            for="progress-notes"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notes (Optional)
          </label>
          <textarea
            id="progress-notes"
            v-model="progressNotes"
            rows="3"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add notes about your progress..."
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showProgressUpdateModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="updateProgress"
            :disabled="updatingProgress"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <loader-icon v-if="updatingProgress" class="animate-spin h-5 w-5" />
            <span v-else>Update</span>
          </button>
        </div>
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
          Delete Objective
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete
          <span class="font-semibold">{{ objectiveToDelete?.title }}</span
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
            @click="deleteObjective"
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
import { ref, computed, onMounted } from "vue";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  Target as TargetIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  PlusCircle as PlusCircleIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

// State
const objectives = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const updatingProgress = ref(false);
const showAddObjectiveModal = ref(false);
const showProgressUpdateModal = ref(false);
const showDeleteModal = ref(false);
const editingObjective = ref(null);
const objectiveToDelete = ref(null);
const objectiveToUpdate = ref(null);
const searchQuery = ref("");
const statusFilter = ref("");
const sortBy = ref("date");
const newSkill = ref("");
const progressValue = ref(0);
const progressNotes = ref("");

// Form state
const objectiveForm = ref({
  title: "",
  description: "",
  status: "Not Started",
  progress: 0,
  deadline: "",
  relatedSkills: [],
});

// Computed
const filteredObjectives = computed(() => {
  let result = [...objectives.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (objective) =>
        objective.title.toLowerCase().includes(query) ||
        (objective.description &&
          objective.description.toLowerCase().includes(query)) ||
        (objective.relatedSkills &&
          objective.relatedSkills.some((skill) =>
            skill.toLowerCase().includes(query)
          ))
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(
      (objective) => objective.status === statusFilter.value
    );
  }

  // Apply sorting
  if (sortBy.value === "title") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy.value === "date") {
    result.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
  } else if (sortBy.value === "progress") {
    result.sort((a, b) => b.progress - a.progress);
  } else if (sortBy.value === "deadline") {
    result.sort((a, b) => {
      // Put objectives without deadlines at the end
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      const dateA = a.deadline?.toDate?.() || new Date(a.deadline);
      const dateB = b.deadline?.toDate?.() || new Date(b.deadline);
      return dateA - dateB;
    });
  }

  return result;
});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    await fetchObjectives();
  }
});

// Methods
const fetchObjectives = async () => {
  loading.value = true;
  try {
    const userId = auth.currentUser.uid;
    const objectivesQuery = query(
      collection(db, "objectives"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(objectivesQuery);
    objectives.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    // console.error("Error fetching objectives:", error);
  } finally {
    loading.value = false;
  }
};

const editObjective = (objective) => {
  editingObjective.value = objective;
  objectiveForm.value = {
    title: objective.title,
    description: objective.description || "",
    status: objective.status,
    progress: objective.progress,
    deadline: objective.deadline ? formatDateForInput(objective.deadline) : "",
    relatedSkills: objective.relatedSkills ? [...objective.relatedSkills] : [],
  };
  showAddObjectiveModal.value = true;
};

const resetForm = () => {
  objectiveForm.value = {
    title: "",
    description: "",
    status: "Not Started",
    progress: 0,
    deadline: "",
    relatedSkills: [],
  };
  newSkill.value = "";
  editingObjective.value = null;
};

const addRelatedSkill = () => {
  if (newSkill.value.trim()) {
    objectiveForm.value.relatedSkills.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

const removeRelatedSkill = (index) => {
  objectiveForm.value.relatedSkills.splice(index, 1);
};

const saveObjective = async () => {
  saving.value = true;
  try {
    const userId = auth.currentUser.uid;

    // If status is changed to Completed, set completedAt
    let completedAt = null;
    if (objectiveForm.value.status === "Completed") {
      completedAt = serverTimestamp();
      objectiveForm.value.progress = 100; // Ensure progress is 100% when completed
    }

    // Parse deadline if provided
    let deadline = null;
    if (objectiveForm.value.deadline) {
      deadline = new Date(objectiveForm.value.deadline);
    }

    const objectiveData = {
      title: objectiveForm.value.title,
      description: objectiveForm.value.description,
      status: objectiveForm.value.status,
      progress: parseInt(objectiveForm.value.progress),
      deadline: deadline,
      relatedSkills: objectiveForm.value.relatedSkills,
      userId,
    };

    if (completedAt) {
      objectiveData.completedAt = completedAt;
    }

    if (editingObjective.value) {
      // Update existing objective
      const objectiveRef = doc(db, "objectives", editingObjective.value.id);
      await updateDoc(objectiveRef, {
        ...objectiveData,
        updatedAt: serverTimestamp(),
      });

      // Add activity for objective update
      await addDoc(collection(db, "activities"), {
        type: "objective",
        action: "update",
        description: `Updated objective: ${objectiveData.title}`,
        objectiveId: editingObjective.value.id,
        userId,
        timestamp: serverTimestamp(),
      });

      // Update local state
      const index = objectives.value.findIndex(
        (o) => o.id === editingObjective.value.id
      );
      if (index !== -1) {
        objectives.value[index] = {
          ...objectives.value[index],
          ...objectiveData,
          updatedAt: new Date(),
          completedAt: completedAt
            ? new Date()
            : objectives.value[index].completedAt,
        };
      }
    } else {
      // Add new objective
      const docRef = await addDoc(collection(db, "objectives"), {
        ...objectiveData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add activity for new objective
      await addDoc(collection(db, "activities"), {
        type: "objective",
        action: "create",
        description: `Added new objective: ${objectiveData.title}`,
        objectiveId: docRef.id,
        userId,
        timestamp: serverTimestamp(),
      });

      // Update local state
      objectives.value.unshift({
        id: docRef.id,
        ...objectiveData,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: completedAt ? new Date() : null,
      });
    }

    showAddObjectiveModal.value = false;
    resetForm();
  } catch (error) {
    // console.error("Error saving objective:", error);
  } finally {
    saving.value = false;
  }
};

const showProgressModal = (objective) => {
  objectiveToUpdate.value = objective;
  progressValue.value = objective.progress;
  progressNotes.value = "";
  showProgressUpdateModal.value = true;
};

const updateProgress = async () => {
  if (!objectiveToUpdate.value) return;

  updatingProgress.value = true;
  try {
    const userId = auth.currentUser.uid;
    const objectiveRef = doc(db, "objectives", objectiveToUpdate.value.id);

    // Determine if the objective is now completed
    const isNowCompleted = parseInt(progressValue.value) === 100;
    const wasCompleted = objectiveToUpdate.value.status === "Completed";

    const updateData = {
      progress: parseInt(progressValue.value),
      updatedAt: serverTimestamp(),
    };

    // If progress is 100%, mark as completed
    if (isNowCompleted && !wasCompleted) {
      updateData.status = "Completed";
      updateData.completedAt = serverTimestamp();
    }
    // If progress is not 100% but was previously completed, change to In Progress
    else if (!isNowCompleted && wasCompleted) {
      updateData.status = "In Progress";
      updateData.completedAt = null;
    }
    // If progress is not 0% and status is Not Started, change to In Progress
    else if (
      parseInt(progressValue.value) > 0 &&
      objectiveToUpdate.value.status === "Not Started"
    ) {
      updateData.status = "In Progress";
    }

    await updateDoc(objectiveRef, updateData);

    // Add activity for progress update
    await addDoc(collection(db, "activities"), {
      type: "objective",
      action: "progress",
      description: `Updated progress on objective: ${objectiveToUpdate.value.title} to ${progressValue.value}%`,
      objectiveId: objectiveToUpdate.value.id,
      notes: progressNotes.value,
      userId,
      timestamp: serverTimestamp(),
    });

    // Update local state
    const index = objectives.value.findIndex(
      (o) => o.id === objectiveToUpdate.value.id
    );
    if (index !== -1) {
      objectives.value[index] = {
        ...objectives.value[index],
        progress: parseInt(progressValue.value),
        status: updateData.status || objectives.value[index].status,
        updatedAt: new Date(),
        completedAt: updateData.completedAt
          ? new Date()
          : objectives.value[index].completedAt,
      };
    }

    showProgressUpdateModal.value = false;
    objectiveToUpdate.value = null;
    progressValue.value = 0;
    progressNotes.value = "";
  } catch (error) {
    // console.error("Error updating progress:", error);
  } finally {
    updatingProgress.value = false;
  }
};

const toggleObjectiveStatus = async (objective) => {
  try {
    const userId = auth.currentUser.uid;
    const objectiveRef = doc(db, "objectives", objective.id);

    const isNowCompleted = objective.status !== "Completed";
    const updateData = {
      status: isNowCompleted ? "Completed" : "In Progress",
      progress: isNowCompleted ? 100 : objective.progress,
      updatedAt: serverTimestamp(),
    };

    if (isNowCompleted) {
      updateData.completedAt = serverTimestamp();
    } else {
      updateData.completedAt = null;
    }

    await updateDoc(objectiveRef, updateData);

    // Add activity
    await addDoc(collection(db, "activities"), {
      type: "objective",
      action: isNowCompleted ? "complete" : "reopen",
      description: isNowCompleted
        ? `Completed objective: ${objective.title}`
        : `Reopened objective: ${objective.title}`,
      objectiveId: objective.id,
      userId,
      timestamp: serverTimestamp(),
    });

    // Update local state
    objective.status = updateData.status;
    objective.progress = updateData.progress;
    objective.updatedAt = new Date();
    objective.completedAt = isNowCompleted ? new Date() : null;
  } catch (error) {
    // console.error("Error toggling objective status:", error);
  }
};

const confirmDeleteObjective = (objective) => {
  objectiveToDelete.value = objective;
  showDeleteModal.value = true;
};

const deleteObjective = async () => {
  if (!objectiveToDelete.value) return;

  deleting.value = true;
  try {
    const objectiveRef = doc(db, "objectives", objectiveToDelete.value.id);
    await deleteDoc(objectiveRef);

    // Add activity for objective deletion
    await addDoc(collection(db, "activities"), {
      type: "objective",
      action: "delete",
      description: `Removed objective: ${objectiveToDelete.value.title}`,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Update local state
    objectives.value = objectives.value.filter(
      (o) => o.id !== objectiveToDelete.value.id
    );
    showDeleteModal.value = false;
    objectiveToDelete.value = null;
  } catch (error) {
    // console.error("Error deleting objective:", error);
  } finally {
    deleting.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Not Started":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatDateForInput = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const isOverdue = (objective) => {
  if (!objective.deadline || objective.status === "Completed") return false;

  const deadline = objective.deadline.toDate
    ? objective.deadline.toDate()
    : new Date(objective.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return deadline < today;
};
</script>
