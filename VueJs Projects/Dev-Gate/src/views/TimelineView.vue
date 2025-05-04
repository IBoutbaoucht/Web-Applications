<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Activity Timeline
      </h1>
      <div class="flex space-x-2">
        <select
          v-model="filterType"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Activities</option>
          <option value="skill">Skills</option>
          <option value="project">Projects</option>
          <option value="objective">Objectives</option>
        </select>
      </div>
    </div>

    <!-- Timeline -->
    <div v-if="loading" class="flex justify-center py-12">
      <loader-icon class="animate-spin h-12 w-12 text-indigo-600" />
    </div>

    <div
      v-else-if="filteredActivities.length === 0"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
    >
      <activity-icon class="h-12 w-12 mx-auto text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No activities found
      </h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        {{
          activities.length === 0
            ? "You don't have any activities yet."
            : "No activities match your current filters."
        }}
      </p>
    </div>

    <div v-else class="relative">
      <!-- Timeline line -->
      <div
        class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
      ></div>

      <!-- Timeline items -->
      <div class="space-y-8">
        <div
          v-for="(activity, index) in filteredActivities"
          :key="activity.id"
          class="relative"
        >
          <!-- Date header if it's a new day -->
          <div
            v-if="
              index === 0 ||
              !isSameDay(
                activity.timestamp,
                filteredActivities[index - 1].timestamp
              )
            "
            class="mb-4 ml-12 text-sm font-semibold text-gray-500 dark:text-gray-400"
          >
            {{ formatDateHeader(activity.timestamp) }}
          </div>

          <!-- Activity item -->
          <div class="flex items-start group">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full z-10"
              :class="getActivityIconClass(activity.type)"
            >
              <code-icon v-if="activity.type === 'skill'" class="h-5 w-5" />
              <folder-icon
                v-else-if="activity.type === 'project'"
                class="h-5 w-5"
              />
              <target-icon
                v-else-if="activity.type === 'objective'"
                class="h-5 w-5"
              />
              <activity-icon v-else class="h-5 w-5" />
            </div>

            <div class="ml-4 flex-1">
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ activity.description }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ formatTime(activity.timestamp) }}
                    </p>
                  </div>
                  <button
                    @click="deleteActivity(activity)"
                    class="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <trash-icon class="h-4 w-4" />
                  </button>
                </div>

                <!-- Related content preview based on activity type -->
                <div
                  v-if="activity.type === 'skill' && activity.skillData"
                  class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
                >
                  <div class="flex justify-between">
                    <span
                      class="font-medium text-gray-700 dark:text-gray-300"
                      >{{ activity.skillData.name }}</span
                    >
                    <span
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="getSkillLevelClass(activity.skillData.level)"
                    >
                      {{ activity.skillData.level }}
                    </span>
                  </div>
                </div>

                <div
                  v-else-if="
                    activity.type === 'project' && activity.projectData
                  "
                  class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
                >
                  <div class="flex items-start">
                    <div
                      v-if="activity.projectData.imageUrl"
                      class="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3 flex-shrink-0"
                    >
                      <img
                        :src="activity.projectData.imageUrl"
                        alt="Project"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div class="font-medium text-gray-700 dark:text-gray-300">
                        {{ activity.projectData.title }}
                      </div>
                      <p
                        class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1"
                      >
                        {{ activity.projectData.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="
                    activity.type === 'objective' && activity.objectiveData
                  "
                  class="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
                >
                  <div class="flex items-center">
                    <div class="flex-1">
                      <div class="font-medium text-gray-700 dark:text-gray-300">
                        {{ activity.objectiveData.title }}
                      </div>
                      <div class="mt-1 flex items-center">
                        <div
                          class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                        >
                          <div
                            class="bg-indigo-600 h-1.5 rounded-full"
                            :style="{
                              width: `${activity.objectiveData.progress}%`,
                            }"
                          ></div>
                        </div>
                        <span
                          class="ml-2 text-xs text-gray-500 dark:text-gray-400"
                          >{{ activity.objectiveData.progress }}%</span
                        >
                      </div>
                    </div>
                    <div class="ml-2">
                      <span
                        class="text-xs px-2 py-0.5 rounded-full"
                        :class="
                          activity.objectiveData.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        "
                      >
                        {{ activity.objectiveData.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  getDoc,
  doc,
  deleteDoc,
  limit,
} from "firebase/firestore";
import { db, auth } from "../firebase";
// Fix the imports from lucide-vue-next
import { Code, Folder, Activity, Target, Trash, Loader } from "lucide-vue-next";

// Rename the imported components to match the usage in the template
const CodeIcon = Code;
const FolderIcon = Folder;
const ActivityIcon = Activity;
const TargetIcon = Target;
const TrashIcon = Trash;
const LoaderIcon = Loader;

// State
const activities = ref([]);
const loading = ref(true);
const filterType = ref("");

// Computed
const filteredActivities = computed(() => {
  if (!filterType.value) {
    return activities.value;
  }
  return activities.value.filter(
    (activity) => activity.type === filterType.value
  );
});

// Lifecycle
onMounted(async () => {
  if (auth.currentUser) {
    await fetchActivities();
  }
});

// Methods
const fetchActivities = async () => {
  loading.value = true;
  try {
    const userId = auth.currentUser.uid;
    const activitiesQuery = query(
      collection(db, "activities"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(activitiesQuery);

    // Get activities
    const activitiesData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch related data for each activity
    const activitiesWithData = await Promise.all(
      activitiesData.map(async (activity) => {
        if (activity.type === "skill" && activity.skillId) {
          try {
            const skillDoc = await getDoc(doc(db, "skills", activity.skillId));
            if (skillDoc.exists()) {
              activity.skillData = skillDoc.data();
            }
          } catch (error) {
            // console.error("Error fetching skill data:", error);
          }
        } else if (activity.type === "project" && activity.projectId) {
          try {
            const projectDoc = await getDoc(
              doc(db, "projects", activity.projectId)
            );
            if (projectDoc.exists()) {
              activity.projectData = projectDoc.data();
            }
          } catch (error) {
            // console.error("Error fetching project data:", error);
          }
        } else if (activity.type === "objective" && activity.objectiveId) {
          try {
            const objectiveDoc = await getDoc(
              doc(db, "objectives", activity.objectiveId)
            );
            if (objectiveDoc.exists()) {
              activity.objectiveData = objectiveDoc.data();
            }
          } catch (error) {
            // console.error("Error fetching objective data:", error);
          }
        }
        return activity;
      })
    );

    activities.value = activitiesWithData;
  } catch (error) {
    // console.error("Error fetching activities:", error);
  } finally {
    loading.value = false;
  }
};

const deleteActivity = async (activity) => {
  try {
    await deleteDoc(doc(db, "activities", activity.id));
    activities.value = activities.value.filter((a) => a.id !== activity.id);
  } catch (error) {
    // console.error("Error deleting activity:", error);
  }
};

const getActivityIconClass = (type) => {
  switch (type) {
    case "skill":
      return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400";
    case "project":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400";
    case "objective":
      return "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400";
    default:
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400";
  }
};

const getSkillLevelClass = (level) => {
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

const formatTime = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateHeader = (timestamp) => {
  if (!timestamp) return "";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return "Today";
  } else if (isSameDay(date, yesterday)) {
    return "Yesterday";
  } else {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
};

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  const d1 = date1.toDate ? date1.toDate() : new Date(date1);
  const d2 = date2.toDate ? date2.toDate() : new Date(date2);

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};
</script>
