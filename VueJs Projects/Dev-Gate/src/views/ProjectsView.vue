<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
      <button
        @click="showAddProjectModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Project
      </button>
    </div>

    <!-- View Toggle -->
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
              placeholder="Search projects..."
              class="pl-10 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div class="w-full md:w-48">
          <label
            for="project-filter"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Show</label
          >
          <select
            id="project-filter"
            v-model="projectFilter"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Projects</option>
            <option value="owned">My Projects</option>
            <option value="collaborated">Collaborations</option>
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
            <option value="title">Title</option>
            <option value="date">Date Added</option>
          </select>
        </div>
        <div class="w-full md:w-48 flex flex-col">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >View</label
          >
          <div
            class="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden"
          >
            <button
              @click="viewMode = 'grid'"
              class="flex-1 px-4 py-2 flex justify-center items-center"
              :class="
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              "
            >
              <grid-icon class="h-5 w-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="flex-1 px-4 py-2 flex justify-center items-center"
              :class="
                viewMode === 'list'
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              "
            >
              <list-icon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects List -->
    <div v-if="loading" class="flex justify-center py-12">
      <loader-icon class="animate-spin h-12 w-12 text-indigo-600" />
    </div>

    <div
      v-else-if="filteredProjects.length === 0"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
    >
      <folder-icon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No projects found
      </h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          projects.length === 0
            ? "You haven't added any projects yet."
            : "No projects match your current filters."
        }}
      </p>
      <button
        v-if="projects.length === 0"
        @click="showAddProjectModal = true"
        class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md inline-flex items-center"
      >
        <plus-icon class="h-5 w-5 mr-1" />
        Add Your First Project
      </button>
    </div>

    <!-- Grid View -->
    <div
      v-else-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="h-48 bg-gray-200 dark:bg-gray-700 relative">
          <img
            v-if="project.imageUrl"
            :src="project.imageUrl"
            :alt="project.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <folder-icon class="h-16 w-16 text-gray-400" />
          </div>
          <div class="absolute top-2 right-2 flex space-x-1">
            <button
              v-if="userCanEditProject(project)"
              @click="editProject(project)"
              class="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            >
              <edit-icon class="h-4 w-4" />
            </button>
            <button
              v-if="isProjectOwner(project)"
              @click="confirmDeleteProject(project)"
              class="p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:text-red-600"
            >
              <trash-icon class="h-4 w-4" />
            </button>
          </div>
          <div
            v-if="!isProjectOwner(project)"
            class="absolute top-2 left-2 flex items-center bg-black/40 rounded-full px-2 py-0.5 text-white text-xs"
          >
            <users-icon class="h-3 w-3 mr-1" />
            Collaborator
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              <router-link
                :to="`/projects/${project.id}`"
                class="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {{ project.title }}
              </router-link>
            </h3>
            <button
              v-if="isProjectOwner(project) || userIsAdmin(project)"
              @click="manageCollaborators(project)"
              class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 p-1 rounded-md"
              title="Manage collaborators"
            >
              <users-icon class="h-4 w-4" />
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {{ project.description }}
          </p>

          <div class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="(tech, index) in project.technologies"
              :key="index"
              class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {{ tech }}
            </span>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(project.createdAt) }}
            </span>
            <div class="flex space-x-2">
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
              >
                <github-icon class="h-5 w-5" />
              </a>
              <router-link
                :to="`/projects/${project.id}`"
                class="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
              >
                View
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-4">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-4 flex">
          <div
            class="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0 overflow-hidden relative"
          >
            <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <folder-icon class="h-10 w-10 text-gray-400" />
            </div>
            <div
              v-if="!isProjectOwner(project)"
              class="absolute top-1 left-1 flex items-center bg-black/40 rounded-full px-2 py-0.5 text-white text-xs"
            >
              <users-icon class="h-3 w-3 mr-1" />
              Collab
            </div>
          </div>
          <div class="ml-4 flex-1">
            <div class="flex justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                <router-link
                  :to="`/projects/${project.id}`"
                  class="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {{ project.title }}
                </router-link>
              </h3>
              <div class="flex space-x-2">
                <button
                  v-if="isProjectOwner(project) || userIsAdmin(project)"
                  @click="manageCollaborators(project)"
                  class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                  title="Manage collaborators"
                >
                  <users-icon class="h-4 w-4" />
                </button>
                <a
                  v-if="project.githubUrl"
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
                >
                  <github-icon class="h-5 w-5" />
                </a>
                <button
                  v-if="userCanEditProject(project)"
                  @click="editProject(project)"
                  class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
                >
                  <edit-icon class="h-5 w-5" />
                </button>
                <button
                  v-if="isProjectOwner(project)"
                  @click="confirmDeleteProject(project)"
                  class="text-gray-500 hover:text-red-600 dark:text-gray-400"
                >
                  <trash-icon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {{ project.description }}
            </p>

            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="(tech, index) in project.technologies"
                :key="index"
                class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {{ tech }}
              </span>
            </div>

            <div class="mt-2">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(project.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Project Modal -->
    <div
      v-if="showAddProjectModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
      >
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ editingProject ? "Edit Project" : "Add New Project" }}
          </h2>

          <form @submit.prevent="saveProject">
            <div class="mb-4">
              <label
                for="project-title"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Title
              </label>
              <input
                id="project-title"
                v-model="projectForm.title"
                type="text"
                required
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g. Portfolio Website, E-commerce App"
              />
            </div>

            <div class="mb-4">
              <label
                for="project-description"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="project-description"
                v-model="projectForm.description"
                rows="3"
                required
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe your project..."
              ></textarea>
            </div>

            <div class="mb-4">
              <label
                for="project-technologies"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Technologies Used
              </label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div
                  v-for="(tech, index) in projectForm.technologies"
                  :key="index"
                  class="flex items-center bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ tech }}
                  <button
                    type="button"
                    @click="removeTechnology(index)"
                    class="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                  >
                    <x-icon class="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div class="flex">
                <input
                  id="project-technologies"
                  v-model="newTechnology"
                  type="text"
                  class="block w-full rounded-l-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. React, Node.js, MongoDB"
                  @keydown.enter.prevent="addTechnology"
                />
                <button
                  type="button"
                  @click="addTechnology"
                  class="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label
                for="project-github"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                GitHub URL (Optional)
              </label>
              <input
                id="project-github"
                v-model="projectForm.githubUrl"
                type="url"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div class="mb-6">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Project Image (Optional)
              </label>
              <div class="mt-1 flex items-center">
                <div
                  class="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Preview"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="text-center p-4">
                    <image-icon class="h-8 w-8 mx-auto text-gray-400" />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Upload image
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageChange"
                />
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="ml-4 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Choose File
                </button>
                <button
                  v-if="imagePreview"
                  type="button"
                  @click="clearImage"
                  class="ml-2 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-red-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Remove
                </button>
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelProjectModal"
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
                <span v-else>{{ editingProject ? "Update" : "Save" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Collaborators Modal -->
    <div
      v-if="showCollaboratorsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Manage Collaborators
            </h2>
            <button
              @click="showCollaboratorsModal = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <x-icon class="h-5 w-5" />
            </button>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Project:
            <span class="font-medium">{{ selectedProject?.title }}</span>
          </p>

          <project-collaborators
            v-if="selectedProject"
            :project-id="selectedProject.id"
            :project-name="selectedProject.title"
            :owner-id="selectedProject.userId"
            @collaborator-updated="collaboratorUpdated"
          />
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
          Delete Project
        </h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete
          <span class="font-semibold">{{ projectToDelete?.title }}</span
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
            @click="deleteProject"
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
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, auth, storage } from "../firebase";
import ProjectCollaborators from "../components/project-collaborators.vue";
import {
  Folder as FolderIcon,
  Plus as PlusIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Grid as GridIcon,
  List as ListIcon,
  Github as GithubIcon,
  Image as ImageIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Users as UsersIcon,
} from "lucide-vue-next";

// State
const projects = ref([]);
const collaboratedProjects = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const showAddProjectModal = ref(false);
const showDeleteModal = ref(false);
const showCollaboratorsModal = ref(false);
const editingProject = ref(null);
const projectToDelete = ref(null);
const selectedProject = ref(null);
const searchQuery = ref("");
const sortBy = ref("date");
const viewMode = ref("grid");
const projectFilter = ref("all");
const fileInput = ref(null);
const imagePreview = ref("");
const imageFile = ref(null);
const newTechnology = ref("");
const projectRoles = ref({});

// Form state
const projectForm = ref({
  title: "",
  description: "",
  technologies: [],
  githubUrl: "",
  imageUrl: "",
});

// Computed
const filteredProjects = computed(() => {
  let result = [...projects.value];

  // Add collaborated projects if needed
  if (projectFilter.value === "all") {
    // Combine owned and collaborated projects, avoiding duplicates
    const allProjectIds = new Set(result.map((p) => p.id));
    const filteredCollaborated = collaboratedProjects.value.filter(
      (p) => !allProjectIds.has(p.id)
    );
    result = [...result, ...filteredCollaborated];
  } else if (projectFilter.value === "collaborated") {
    result = [...collaboratedProjects.value];
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
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
  }

  return result;
});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    await fetchProjects();
  }
});

// Methods
const fetchProjects = async () => {
  loading.value = true;
  try {
    const userId = auth.currentUser.uid;

    // Fetch owned projects
    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(projectsQuery);
    projects.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch projects where user is a collaborator
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("userId", "==", userId)
    );
    const collaboratorsSnapshot = await getDocs(collaboratorsQuery);

    if (!collaboratorsSnapshot.empty) {
      const projectIds = collaboratorsSnapshot.docs.map((doc) => {
        const data = doc.data();
        // Store the role for this project
        projectRoles.value[data.projectId] = data.role;
        return data.projectId;
      });

      // Fetch the actual project data
      const collaboratedProjectsQuery = query(
        collection(db, "projects"),
        where("__name__", "in", projectIds)
      );

      const collabProjectsSnapshot = await getDocs(collaboratedProjectsQuery);
      collaboratedProjects.value = collabProjectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Add the role to the project object for easier access
        role: projectRoles.value[doc.id],
      }));
    } else {
      collaboratedProjects.value = [];
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    loading.value = false;
  }
};

const editProject = (project) => {
  editingProject.value = project;
  projectForm.value = {
    title: project.title,
    description: project.description,
    technologies: [...project.technologies],
    githubUrl: project.githubUrl || "",
    imageUrl: project.imageUrl || "",
  };
  imagePreview.value = project.imageUrl || "";
  showAddProjectModal.value = true;
};

const resetForm = () => {
  projectForm.value = {
    title: "",
    description: "",
    technologies: [],
    githubUrl: "",
    imageUrl: "",
  };
  imagePreview.value = "";
  imageFile.value = null;
  newTechnology.value = "";
  editingProject.value = null;
};

const cancelProjectModal = () => {
  showAddProjectModal.value = false;
  resetForm();
};

const addTechnology = () => {
  if (newTechnology.value.trim()) {
    projectForm.value.technologies.push(newTechnology.value.trim());
    newTechnology.value = "";
  }
};

const removeTechnology = (index) => {
  projectForm.value.technologies.splice(index, 1);
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const clearImage = () => {
  imagePreview.value = "";
  imageFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const uploadImage = async () => {
  if (!imageFile.value) return null;

  const userId = auth.currentUser.uid;
  const path = `projects/${userId}/${Date.now()}_${imageFile.value.name}`;
  const fileRef = storageRef(storage, path);

  await uploadBytes(fileRef, imageFile.value);
  return await getDownloadURL(fileRef);
};

const saveProject = async () => {
  saving.value = true;
  try {
    const userId = auth.currentUser.uid;

    // Upload image if there's a new one
    let imageUrl = projectForm.value.imageUrl;
    if (imageFile.value) {
      imageUrl = await uploadImage();
    }

    const projectData = {
      title: projectForm.value.title,
      description: projectForm.value.description,
      technologies: projectForm.value.technologies,
      githubUrl: projectForm.value.githubUrl,
      imageUrl,
      userId,
    };

    if (editingProject.value) {
      // Update existing project
      const projectRef = doc(db, "projects", editingProject.value.id);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp(),
      });

      // Add activity for project update
      await addDoc(collection(db, "activities"), {
        type: "project",
        action: "update",
        description: `Updated project: ${projectData.title}`,
        projectId: editingProject.value.id,
        userId,
        timestamp: serverTimestamp(),
      });

      // Update local state
      const index = projects.value.findIndex(
        (p) => p.id === editingProject.value.id
      );
      if (index !== -1) {
        projects.value[index] = {
          ...projects.value[index],
          ...projectData,
          updatedAt: new Date(),
        };
      }
    } else {
      // Add new project
      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add activity for new project
      await addDoc(collection(db, "activities"), {
        type: "project",
        action: "create",
        description: `Added new project: ${projectData.title}`,
        projectId: docRef.id,
        userId,
        timestamp: serverTimestamp(),
      });

      // Update local state
      projects.value.unshift({
        id: docRef.id,
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    showAddProjectModal.value = false;
    resetForm();
  } catch (error) {
    console.error("Error saving project:", error);
  } finally {
    saving.value = false;
  }
};

const confirmDeleteProject = (project) => {
  projectToDelete.value = project;
  showDeleteModal.value = true;
};

const deleteProject = async () => {
  if (!projectToDelete.value) return;

  deleting.value = true;
  try {
    // Delete collaborators records first
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", projectToDelete.value.id)
    );
    const collabSnapshot = await getDocs(collaboratorsQuery);

    for (const doc of collabSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Delete image from storage if exists
    if (projectToDelete.value.imageUrl) {
      try {
        const imageRef = storageRef(storage, projectToDelete.value.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image:", error);
        // Continue with project deletion even if image deletion fails
      }
    }

    const projectRef = doc(db, "projects", projectToDelete.value.id);
    await deleteDoc(projectRef);

    // Add activity for project deletion
    await addDoc(collection(db, "activities"), {
      type: "project",
      action: "delete",
      description: `Removed project: ${projectToDelete.value.title}`,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });

    // Update local state
    projects.value = projects.value.filter(
      (p) => p.id !== projectToDelete.value.id
    );
    showDeleteModal.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error("Error deleting project:", error);
  } finally {
    deleting.value = false;
  }
};

const manageCollaborators = (project) => {
  selectedProject.value = project;
  showCollaboratorsModal.value = true;
};

const collaboratorUpdated = () => {
  // Refresh the project list to reflect any changes in collaboration status
  fetchProjects();
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

const isProjectOwner = (project) => {
  return project.userId === auth.currentUser.uid;
};

const userCanEditProject = (project) => {
  // Owner can always edit
  if (isProjectOwner(project)) return true;

  // Check if user has write or admin access
  const role = projectRoles.value[project.id];
  return role === "write" || role === "admin";
};

const userIsAdmin = (project) => {
  // Check if user has admin access to project
  if (isProjectOwner(project)) return true;
  return projectRoles.value[project.id] === "admin";
};
</script>
