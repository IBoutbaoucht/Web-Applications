<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div
      class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0 h-5 w-5 mr-2">
          <component
            :is="getLanguageIcon"
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
          />
        </div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white">
          {{ snippet.title }}
        </h3>
      </div>
      <div class="flex space-x-2">
        <span
          class="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
        >
          {{ snippet.language }}
        </span>
        <button
          v-if="canEdit"
          @click="$emit('edit', snippet)"
          class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
        >
          <edit-icon class="h-4 w-4" />
        </button>
        <button
          v-if="canEdit"
          @click="$emit('delete', snippet)"
          class="text-gray-500 hover:text-red-600 dark:text-gray-400"
        >
          <trash-icon class="h-4 w-4" />
        </button>
        <button
          @click="copyToClipboard"
          class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
          :title="copied ? 'Copied!' : 'Copy to clipboard'"
        >
          <clipboard-copy-icon v-if="!copied" class="h-4 w-4" />
          <check-icon v-else class="h-4 w-4 text-green-500" />
        </button>
      </div>
    </div>
    <div class="relative">
      <pre
        class="language-{{ snippet.language }} p-4 overflow-x-auto text-sm"
        v-html="highlightedCode"
      ></pre>
      <div
        class="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
      >
        <button
          @click="expandCode = !expandCode"
          class="p-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
        >
          <maximize-2-icon v-if="!expandCode" class="h-4 w-4" />
          <minimize-2-icon v-else class="h-4 w-4" />
        </button>
      </div>
    </div>
    <div
      v-if="snippet.description"
      class="px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300"
    >
      {{ snippet.description }}
    </div>
  </div>

  <!-- Full screen modal for expanded view -->
  <div
    v-if="expandCode"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
    >
      <div
        class="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-center">
          <component
            :is="getLanguageIcon"
            class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"
          />
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ snippet.title }}
          </h3>
        </div>
        <div class="flex space-x-2">
          <span
            class="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
          >
            {{ snippet.language }}
          </span>
          <button
            @click="copyToClipboard"
            class="text-gray-500 hover:text-indigo-600 dark:text-gray-400"
            :title="copied ? 'Copied!' : 'Copy to clipboard'"
          >
            <clipboard-copy-icon v-if="!copied" class="h-4 w-4" />
            <check-icon v-else class="h-4 w-4 text-green-500" />
          </button>
          <button
            @click="expandCode = false"
            class="text-gray-500 hover:text-red-600 dark:text-gray-400"
          >
            <x-icon class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div class="overflow-auto flex-1">
        <pre
          class="language-{{ snippet.language }} p-4 overflow-x-auto text-sm"
          v-html="highlightedCode"
        ></pre>
      </div>
      <div
        v-if="snippet.description"
        class="px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300"
      >
        {{ snippet.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-dart";
import {
  Edit as EditIcon,
  Trash as TrashIcon,
  ClipboardCopy as ClipboardCopyIcon,
  Check as CheckIcon,
  Maximize2 as Maximize2Icon,
  Minimize2 as Minimize2Icon,
  X as XIcon,
  Code as CodeIcon,
  FileJson as FileJsonIcon,
  FileText as FileTextIcon,
  Terminal as TerminalIcon,
  Database as DatabaseIcon,
} from "lucide-vue-next";

const props = defineProps({
  snippet: {
    type: Object,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["edit", "delete"]);

const copied = ref(false);
const expandCode = ref(false);

const highlightedCode = computed(() => {
  const language = props.snippet.language || "javascript";
  const code = props.snippet.code || "";

  try {
    // Make sure the language is loaded
    if (Prism.languages[language]) {
      return Prism.highlight(code, Prism.languages[language], language);
    } else {
      // Fallback to plain text
      return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  } catch (error) {
    console.error("Error highlighting code:", error);
    return code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});

const getLanguageIcon = computed(() => {
  const language = props.snippet.language?.toLowerCase() || "";

  if (["javascript", "typescript", "jsx", "tsx"].includes(language)) {
    return CodeIcon;
  } else if (["json", "yaml", "xml"].includes(language)) {
    return FileJsonIcon;
  } else if (["html", "css", "markdown", "md"].includes(language)) {
    return FileTextIcon;
  } else if (["bash", "shell", "powershell", "cmd"].includes(language)) {
    return TerminalIcon;
  } else if (["sql", "mysql", "postgresql", "mongodb"].includes(language)) {
    return DatabaseIcon;
  } else {
    return CodeIcon;
  }
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.snippet.code).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
};

onMounted(() => {
  // Ensure Prism highlights code on mount
  Prism.highlightAll();
});
</script>

<style>
/* Add any custom styling for code blocks here */
pre {
  margin: 0;
  border-radius: 0;
}

/* Dark mode adjustments for Prism */
.dark pre[class*="language-"] {
  background: #1e293b;
}
</style>
