<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
      {{ isEditing ? "Edit Code Snippet" : "Add Code Snippet" }}
    </h2>

    <form @submit.prevent="saveSnippet">
      <div class="mb-4">
        <label
          for="snippet-title"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Title
        </label>
        <input
          id="snippet-title"
          v-model="form.title"
          type="text"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="e.g. Authentication Function, API Request"
        />
      </div>

      <div class="mb-4">
        <label
          for="snippet-language"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Language
        </label>
        <select
          id="snippet-language"
          v-model="form.language"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select a language</option>
          <option
            v-for="lang in languages"
            :key="lang.value"
            :value="lang.value"
          >
            {{ lang.label }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label
          for="snippet-code"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Code
        </label>
        <div class="relative">
          <textarea
            id="snippet-code"
            v-model="form.code"
            rows="10"
            required
            class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
            placeholder="Paste your code here..."
          ></textarea>
          <div class="absolute top-2 right-2">
            <button
              type="button"
              @click="toggleFullscreen"
              class="p-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
              title="Toggle fullscreen"
            >
              <maximize-2-icon v-if="!isFullscreen" class="h-4 w-4" />
              <minimize-2-icon v-else class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <label
          for="snippet-description"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description (Optional)
        </label>
        <textarea
          id="snippet-description"
          v-model="form.description"
          rows="3"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Add a brief description of what this code does..."
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
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
          <span v-else>{{ isEditing ? "Update" : "Save" }}</span>
        </button>
      </div>
    </form>

    <!-- Fullscreen editor modal -->
    <div
      v-if="isFullscreen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        <div
          class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
        >
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            Edit Code
          </h3>
          <button
            @click="toggleFullscreen"
            class="text-gray-500 hover:text-red-600 dark:text-gray-400"
          >
            <x-icon class="h-4 w-4" />
          </button>
        </div>
        <div class="p-4 flex-1">
          <textarea
            v-model="form.code"
            class="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import {
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  X as XIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

const props = defineProps({
  snippet: {
    type: Object,
    default: () => ({
      title: "",
      language: "",
      code: "",
      description: "",
    }),
  },
  saving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const form = ref({
  title: props.snippet.title || "",
  language: props.snippet.language || "",
  code: props.snippet.code || "",
  description: props.snippet.description || "",
});

const isFullscreen = ref(false);

const isEditing = computed(() => {
  return !!props.snippet.id;
});

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "jsx", label: "JSX" },
  { value: "tsx", label: "TSX" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "bash", label: "Bash" },
  { value: "sql", label: "SQL" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "dart", label: "Dart" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
];

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const saveSnippet = () => {
  emit("save", {
    ...props.snippet,
    title: form.value.title,
    language: form.value.language,
    code: form.value.code,
    description: form.value.description,
  });
};
</script>
