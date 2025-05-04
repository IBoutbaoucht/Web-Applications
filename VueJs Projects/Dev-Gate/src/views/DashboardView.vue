<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Stats Cards -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center"
      >
        <div
          class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4"
        >
          <code-icon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Skills
          </h2>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ skillsCount }}
          </p>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center"
      >
        <div
          class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4"
        >
          <folder-icon class="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Projects
          </h2>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ projectsCount }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Recent Projects
        </h2>
        <router-link
          to="/projects"
          class="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
        >
          View All
        </router-link>
      </div>

      <div v-if="loadingProjects" class="flex justify-center py-12">
        <loader-icon class="animate-spin h-8 w-8 text-indigo-600" />
      </div>

      <div
        v-else-if="recentProjects.length === 0"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
      >
        <folder-icon class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No projects yet
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Start tracking your development projects
        </p>
        <router-link
          to="/projects"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <plus-icon class="h-5 w-5 mr-1" />
          Add Project
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in recentProjects"
          :key="project.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <div class="h-32 bg-gray-200 dark:bg-gray-700 relative">
            <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <folder-icon class="h-12 w-12 text-gray-400" />
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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ project.title }}
            </h3>
            <p
              class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2"
            >
              {{ project.description }}
            </p>

            <div class="mt-3 flex flex-wrap gap-1">
              <span
                v-for="(tech, index) in project.technologies.slice(0, 3)"
                :key="index"
                class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {{ tech }}
              </span>
              <span
                v-if="project.technologies.length > 3"
                class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                +{{ project.technologies.length - 3 }}
              </span>
            </div>

            <div class="mt-4 flex justify-between items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ formatDate(project.createdAt) }}
              </span>
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

    <!-- Recent Activities -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <router-link
          to="/timeline"
          class="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
        >
          View All
        </router-link>
      </div>

      <div v-if="loadingActivities" class="flex justify-center py-12">
        <loader-icon class="animate-spin h-8 w-8 text-indigo-600" />
      </div>

      <div
        v-else-if="recentActivities.length === 0"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
      >
        <activity-icon class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No activity yet
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Your recent activities will appear here
        </p>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li
            v-for="activity in recentActivities"
            :key="activity.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div class="flex items-start">
              <div
                class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3"
              >
                <activity-icon
                  v-if="activity.type === 'skill'"
                  class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
                <folder-icon
                  v-else-if="activity.type === 'project'"
                  class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
                <target-icon
                  v-else-if="activity.type === 'objective'"
                  class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
                <activity-icon
                  v-else
                  class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ formatDate(activity.timestamp) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  or,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  Code as CodeIcon,
  Folder as FolderIcon,
  Activity as ActivityIcon,
  Target as TargetIcon,
  Plus as PlusIcon,
  Loader as LoaderIcon,
  Users as UsersIcon,
} from "lucide-vue-next";

// State
const skillsCount = ref(0);
const projectsCount = ref(0);
const recentProjects = ref([]);
const recentActivities = ref([]);
const loadingProjects = ref(true);
const loadingActivities = ref(true);
const projectRoles = ref({});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    await Promise.all([
      fetchSkillsCount(),
      fetchProjectsCount(),
      fetchRecentProjects(),
      fetchRecentActivities(),
    ]);
  }
});

// Methods
const fetchSkillsCount = async () => {
  try {
    const skillsQuery = query(
      collection(db, "skills"),
      where("userId", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(skillsQuery);
    skillsCount.value = snapshot.size;
  } catch (error) {
    console.error("Error fetching skills count:", error);
  }
};

const fetchProjectsCount = async () => {
  try {
    // Count owned projects
    const projectsQuery = query(
      collection(db, "projects"),
      where("userId", "==", auth.currentUser.uid)
    );
    const snapshot = await getDocs(projectsQuery);

    // Count collaborated projects
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("userId", "==", auth.currentUser.uid)
    );
    const collabSnapshot = await getDocs(collaboratorsQuery);

    // Total count is owned + collaborated
    projectsCount.value = snapshot.size + collabSnapshot.size;
  } catch (error) {
    console.error("Error fetching projects count:", error);
  }
};

const fetchRecentProjects = async () => {
  loadingProjects.value = true;
  try {
    const userId = auth.currentUser.uid;

    // First, get projects where user is a collaborator
    const collaboratorsQuery = query(
      collection(db, "projectCollaborators"),
      where("userId", "==", userId)
    );
    const collabSnapshot = await getDocs(collaboratorsQuery);

    let projectIds = [];
    if (!collabSnapshot.empty) {
      collabSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        projectRoles.value[data.projectId] = data.role;
        projectIds.push(data.projectId);
      });
    }

    // Now get both owned and collaborated projects
    let projectsQuery;
    if (projectIds.length > 0) {
      projectsQuery = query(
        collection(db, "projects"),
        or(where("userId", "==", userId), where("__name__", "in", projectIds)),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    } else {
      projectsQuery = query(
        collection(db, "projects"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    const snapshot = await getDocs(projectsQuery);
    recentProjects.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching recent projects:", error);
  } finally {
    loadingProjects.value = false;
  }
};

const fetchRecentActivities = async () => {
  loadingActivities.value = true;
  try {
    const activitiesQuery = query(
      collection(db, "activities"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(activitiesQuery);
    recentActivities.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching recent activities:", error);
  } finally {
    loadingActivities.value = false;
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

const isProjectOwner = (project) => {
  return project.userId === auth.currentUser.uid;
};
</script>
