<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <loader-icon class="animate-spin h-12 w-12 text-indigo-600" />
    </div>

    <div v-else-if="!project" class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Project Not Found
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        The project you're looking for doesn't exist or you don't have
        permission to view it.
      </p>
      <router-link
        to="/projects"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <arrow-left-icon class="h-5 w-5 mr-1" />
        Back to Projects
      </router-link>
    </div>

    <div v-else>
      <!-- Project Header -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ project.title }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            {{ project.description }}
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3">
          <button
            v-if="userCanEditProject"
            @click="editProject"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <edit-icon class="h-5 w-5 mr-1" />
            Edit
          </button>
          <button
            v-if="isProjectOwner"
            @click="manageCollaborators"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <users-icon class="h-5 w-5 mr-1" />
            Collaborators
          </button>
        </div>
      </div>

      <!-- Project Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="md:col-span-2">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div class="h-64 bg-gray-200 dark:bg-gray-700 relative">
              <img
                v-if="project.imageUrl"
                :src="project.imageUrl"
                :alt="project.title"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <folder-icon class="h-24 w-24 text-gray-400" />
              </div>
            </div>
            <div class="p-6">
              <div class="mb-4">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Technologies
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(tech, index) in project.technologies"
                    :key="index"
                    class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <div v-if="project.githubUrl" class="mb-4">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  GitHub Repository
                </h3>
                <a
                  :href="project.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                  <github-icon class="h-5 w-5 mr-1" />
                  {{ formatGitHubUrl(project.githubUrl) }}
                </a>
              </div>

              <div class="mb-4">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Project Details
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Created
                    </p>
                    <p class="text-gray-900 dark:text-white">
                      {{ formatDate(project.createdAt) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Last Updated
                    </p>
                    <p class="text-gray-900 dark:text-white">
                      {{ formatDate(project.updatedAt) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Owner
                    </p>
                    <p class="text-gray-900 dark:text-white">
                      {{ projectOwnerName }}
                    </p>
                  </div>
                  <div v-if="!isProjectOwner">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Your Role
                    </p>
                    <p class="text-gray-900 dark:text-white capitalize">
                      {{ userRole }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Collaborators
            </h3>
            <div v-if="loadingCollaborators" class="py-4 flex justify-center">
              <loader-icon class="animate-spin h-5 w-5 text-indigo-600" />
            </div>
            <div
              v-else-if="collaborators.length === 0"
              class="text-center py-4 text-gray-500"
            >
              <p>No collaborators yet</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="collaborator in collaborators"
                :key="collaborator.userId"
                class="flex items-center"
              >
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
                    {{
                      collaborator.role === "owner"
                        ? "Owner"
                        : collaborator.role
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div v-if="isProjectOwner || userIsAdmin" class="mt-4">
              <button
                @click="manageCollaborators"
                class="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
              >
                Manage Collaborators
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Snippets Section -->
      <div class="mb-8">
        <project-code-snippets
          :project-id="project.id"
          :project-name="project.title"
          :owner-id="project.userId"
        />
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
              Project: <span class="font-medium">{{ project.title }}</span>
            </p>

            <project-collaborators
              :project-id="project.id"
              :project-name="project.title"
              :owner-id="project.userId"
              @collaborator-updated="collaboratorUpdated"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { getCollaboratorRole } from "../firebase/collaborations";
import ProjectCollaborators from "../components/project-collaborators.vue";
import ProjectCodeSnippets from "../components/project-code-snippets.vue";
import {
  Folder as FolderIcon,
  Edit as EditIcon,
  Users as UsersIcon,
  User as UserIcon,
  Github as GithubIcon,
  ArrowLeft as ArrowLeftIcon,
  Loader as LoaderIcon,
  X as XIcon,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

// State
const project = ref(null);
const loading = ref(true);
const collaborators = ref([]);
const loadingCollaborators = ref(true);
const showCollaboratorsModal = ref(false);
const projectOwnerName = ref("");
const userRole = ref("");
const userCanEditProject = ref(false);
// Computed
const isProjectOwner = computed(() => {
  return project.value?.userId === auth.currentUser?.uid;
});

const userIsAdmin = computed(() => {
  return userRole.value === "admin";
});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    const id = route.params.id;
    if (id) {
      await fetchProject(id);
      if (project.value) {
        await Promise.all([
          fetchCollaborators(),
          fetchProjectOwner(),
          checkUserRole(),
        ]);
      }
    } else {
      loading.value = false;
    }
  }
});

// Methods
const fetchProject = async (projectId) => {
  loading.value = true;
  try {
    const projectDoc = await getDoc(doc(db, "projects", projectId));

    if (projectDoc.exists()) {
      project.value = {
        id: projectDoc.id,
        ...projectDoc.data(),
      };
    } else {
      project.value = null;
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    project.value = null;
  } finally {
    loading.value = false;
  }
};

const fetchCollaborators = async () => {
  loadingCollaborators.value = true;
  try {
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("projectId", "==", project.value.id)
    );

    const snapshot = await getDocs(collaboratorsQuery);

    const collabData = [];

    // Always add the owner
    const ownerData = {
      userId: project.value.userId,
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
      const ownerDoc = await getDoc(doc(db, "users", project.value.userId));
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
      ...collabData.filter((c) => c.userId !== project.value.userId),
    ];
  } catch (error) {
    console.error("Error fetching collaborators:", error);
  } finally {
    loadingCollaborators.value = false;
  }
};

const fetchProjectOwner = async () => {
  try {
    const ownerDoc = await getDoc(doc(db, "users", project.value.userId));
    if (ownerDoc.exists()) {
      const ownerData = ownerDoc.data();
      projectOwnerName.value =
        ownerData.displayName || ownerData.email || "Unknown";
    } else {
      projectOwnerName.value = "Unknown";
    }
  } catch (error) {
    console.error("Error fetching project owner:", error);
    projectOwnerName.value = "Unknown";
  }
};

const checkUserRole = async () => {
  try {
    const role = await getCollaboratorRole(
      project.value.id,
      auth.currentUser.uid
    );
    userRole.value = role || "";

    // User can edit if they are the owner, admin, or have write access
    userCanEditProject.value =
      isProjectOwner.value || role === "admin" || role === "write";
  } catch (error) {
    console.error("Error checking user role:", error);
    userRole.value = "";
    userCanEditProject.value = isProjectOwner.value;
  }
};

const editProject = () => {
  router.push("/projects?edit=" + project.value.id);
};

const manageCollaborators = () => {
  showCollaboratorsModal.value = true;
};

const collaboratorUpdated = async () => {
  await fetchCollaborators();
  await checkUserRole();
};

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatGitHubUrl = (url) => {
  if (!url) return "";

  try {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\//, "");
  } catch (error) {
    return url;
  }
};
</script>
