<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Skills Tracker
      </h1>
      <button
        @click="showAddSkillModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Skill
      </button>
    </div>

    <!-- Skills Filter -->
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
              placeholder="Search skills..."
              class="pl-10 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div class="w-full md:w-48">
          <label
            for="level-filter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Level</label
          >
          <select
            id="level-filter"
            v-model="levelFilter"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
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
            <option value="name">Name</option>
            <option value="level">Level</option>
            <option value="date">Date Added</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Skills List -->
    <div v-if="loading" class="flex justify-center py-12">
      <loader-icon class="animate-spin h-12 w-12 text-indigo-600" />
    </div>

    <div
      v-else-if="filteredSkills.length === 0"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
    >
      <code-icon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No skills found
      </h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          skills.length === 0
            ? "You haven't added any skills yet."
            : "No skills match your current filters."
        }}
      </p>
      <button
        v-if="skills.length === 0"
        @click="showAddSkillModal = true"
        class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Your First Skill
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="skill in filteredSkills"
        :key="skill.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ skill.name }}
            </h3>
            <div class="flex space-x-2">
              <button
                @click="editSkill(skill)"
                class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
              >
                <edit-icon class="h-5 w-5" />
              </button>
              <button
                @click="confirmDeleteSkill(skill)"
                class="text-gray-500 hover:text-red-600 dark:text-gray-400"
              >
                <trash-icon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div class="mt-2 flex items-center">
            <span
              class="text-xs px-2 py-1 rounded-full"
              :class="getLevelClass(skill.level)"
            >
              {{ skill.level }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">
              Added {{ formatDate(skill.createdAt) }}
            </span>
          </div>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400"
                >Proficiency</span
              >
              <span
                class="text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {{ getLevelPercentage(skill.level) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full"
                :style="{ width: `${getLevelPercentage(skill.level)}%` }"
              ></div>
            </div>
          </div>

          <p
            v-if="skill.notes"
            class="mt-4 text-sm text-gray-600 dark:text-gray-300"
          >
            {{ skill.notes }}
          </p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Skill Modal -->
    <div
      v-if="showAddSkillModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
      >
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ editingSkill ? "Edit Skill" : "Add New Skill" }}
          </h2>

          <form @submit.prevent="saveSkill">
            <div class="mb-4">
              <label
                for="skill-name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Skill Name
              </label>
              <input
                id="skill-name"
                v-model="skillForm.name"
                type="text"
                required
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g. JavaScript, React, Docker"
              />
            </div>

            <div class="mb-4">
              <label
                for="skill-level"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Proficiency Level
              </label>
              <select
                id="skill-level"
                v-model="skillForm.level"
                required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div class="mb-4">
              <label
                for="skill-date"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date Acquired
              </label>
              <input
                id="skill-date"
                v-model="skillForm.acquiredDate"
                type="date"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="mb-6">
              <label
                for="skill-notes"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Notes (Optional)
              </label>
              <textarea
                id="skill-notes"
                v-model="skillForm.notes"
                rows="3"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add any notes about this skill..."
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showAddSkillModal = false"
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
                <span v-else>{{ editingSkill ? "Update" : "Save" }}</span>
              </button>
            </div>
          </form>
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
          Delete Skill
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete
          <span class="font-semibold">{{ skillToDelete?.name }}</span
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
            @click="deleteSkill"
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
  Code as CodeIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

// State
const skills = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const showAddSkillModal = ref(false);
const showDeleteModal = ref(false);
const editingSkill = ref(null);
const skillToDelete = ref(null);
const searchQuery = ref("");
const levelFilter = ref("");
const sortBy = ref("name");

// Form state
const skillForm = ref({
  name: "",
  level: "Beginner",
  acquiredDate: new Date().toISOString().split("T")[0],
  notes: "",
});

// Computed
const filteredSkills = computed(() => {
  let result = [...skills.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        (skill.notes && skill.notes.toLowerCase().includes(query))
    );
  }

  // Apply level filter
  if (levelFilter.value) {
    result = result.filter((skill) => skill.level === levelFilter.value);
  }

  // Apply sorting
  if (sortBy.value === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === "level") {
    const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
    result.sort((a, b) => levelOrder[b.level] - levelOrder[a.level]);
  } else if (sortBy.value === "date") {
    result.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
  }

  return result;
});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    await fetchSkills();
  }
});

// Methods
const fetchSkills = async () => {
  loading.value = true;
  try {
    const userId = auth.currentUser.uid;
    const q = query(
      collection(db, "skills"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    skills.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    // console.error("Error fetching skills:", error);
  } finally {
    loading.value = false;
  }
};

const editSkill = (skill) => {
  editingSkill.value = skill;
  skillForm.value = {
    name: skill.name,
    level: skill.level,
    acquiredDate: skill.acquiredDate || new Date().toISOString().split("T")[0],
    notes: skill.notes || "",
  };
  showAddSkillModal.value = true;
};

// const resetForm = () => {
//   skillForm.value = {
//     name: "",
//     level: "Beginner",
//     acquiredDate: new Date().toISOString().split("T")[0],
//     notes: "",
//   };
//   editingSkill.value = null;
// };

const saveSkill = async () => {
  if (!skillForm.value.name || !skillForm.value.level) {
    return; // simple validation
  }

  saving.value = true;
  try {
    const userId = auth.currentUser.uid; // make sure user is logged in
    const skillsCollection = collection(db, "skills");
    // console.log(userId);
    if (editingSkill.value) {
      // Update existing skill
      const skillDocRef = doc(db, "skills", editingSkill.value.id);
      await updateDoc(skillDocRef, {
        ...skillForm.value,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new skill
      await addDoc(skillsCollection, {
        userId: userId, // associate skill to current user
        name: skillForm.value.name,
        level: skillForm.value.level,
        acquiredDate: skillForm.value.acquiredDate || null,
        notes: skillForm.value.notes || "",
        createdAt: serverTimestamp(),
      });
    }

    // Refresh the skills list
    fetchSkills();
    // Close the modal
    showAddSkillModal.value = false;
    editingSkill.value = null;

    // Reset form
    skillForm.value = {
      name: "",
      level: "Beginner",
      acquiredDate: new Date().toISOString().split("T")[0],
      notes: "",
    };
  } catch (error) {
    // console.error("Error saving skill:", error);
    alert("Failed to save skill. Try again.");
  } finally {
    saving.value = false;
  }
};

const confirmDeleteSkill = (skill) => {
  skillToDelete.value = skill;
  showDeleteModal.value = true;
};

const deleteSkill = async () => {
  if (!skillToDelete.value) return;

  deleting.value = true;
  try {
    const skillRef = doc(db, "skills", skillToDelete.value.id);
    await deleteDoc(skillRef);

    // Add activity for skill deletion
    await addDoc(collection(db, "activities"), {
      type: "skill",
      action: "delete",
      description: `Removed skill: ${skillToDelete.value.name}`,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Update local state
    skills.value = skills.value.filter((s) => s.id !== skillToDelete.value.id);
    showDeleteModal.value = false;
    skillToDelete.value = null;
  } catch (error) {
    // console.error("Error deleting skill:", error);
  } finally {
    deleting.value = false;
  }
};

const getLevelClass = (level) => {
  switch (level) {
    case "Beginner":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Advanced":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

const getLevelPercentage = (level) => {
  switch (level) {
    case "Beginner":
      return 33;
    case "Intermediate":
      return 66;
    case "Advanced":
      return 100;
    default:
      return 0;
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
</script>
