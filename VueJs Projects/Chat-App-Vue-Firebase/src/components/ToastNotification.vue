/* eslint-disable */
<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        getToastClass(toast.type),
        'px-4 py-3 rounded-lg shadow-lg flex items-center justify-between transition-all duration-300 max-w-md',
      ]"
    >
      <div class="mr-2">{{ toast.message }}</div>
      <button
        @click="removeToast(toast.id)"
        class="text-white opacity-70 hover:opacity-100 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const toasts = ref([]);
    let toastCounter = 0;

    const showToast = (message, type = "success", duration = 3000) => {
      const id = toastCounter++;
      toasts.value.push({ id, message, type });

      setTimeout(() => {
        removeToast(id);
      }, duration);
    };

    const removeToast = (id) => {
      const index = toasts.value.findIndex((toast) => toast.id === id);
      if (index !== -1) {
        toasts.value.splice(index, 1);
      }
    };

    const getToastClass = (type) => {
      switch (type) {
        case "success":
          return "bg-green-500 text-white";
        case "error":
          return "bg-red-500 text-white";
        case "warning":
          return "bg-yellow-500 text-white";
        case "info":
          return "bg-blue-500 text-white";
        default:
          return "bg-gray-700 text-white";
      }
    };

    return {
      toasts,
      showToast,
      removeToast,
      getToastClass,
    };
  },
};
</script>
