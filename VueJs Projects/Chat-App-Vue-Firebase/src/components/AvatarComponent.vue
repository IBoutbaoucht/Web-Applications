/* eslint-disable */
<template>
  <div class="relative">
    <div
      :class="[
        sizeClasses[size],
        'rounded-full flex items-center justify-center text-white font-semibold overflow-hidden',
      ]"
      :style="{ backgroundColor: getAvatarColor(user.uid || user.email) }"
    >
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        :alt="user.name || user.email"
        class="w-full h-full object-cover"
      />
      <span v-else>{{ getInitials(user.name || user.email) }}</span>
    </div>
    <div
      v-if="showStatus"
      :class="[
        statusClasses[size],
        'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
        {
          'bg-green-500': user.status === 'online',
          'bg-yellow-500': user.status === 'away',
          'bg-gray-500': user.status === 'offline' || !user.status,
        },
      ]"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["xs", "sm", "md", "lg"].includes(value),
    },
    showStatus: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const sizeClasses = {
      xs: "w-6 h-6",
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-16 h-16",
    };

    const statusClasses = {
      xs: "w-2 h-2",
      sm: "w-2.5 h-2.5",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    };

    const getInitials = (name) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };

    const getAvatarColor = (identifier) => {
      if (!identifier) return "#6B7280"; // gray-500

      const colors = [
        "#EF4444", // red-500
        "#F59E0B", // amber-500
        "#10B981", // emerald-500
        "#3B82F6", // blue-500
        "#8B5CF6", // violet-500
        "#EC4899", // pink-500
        "#6366F1", // indigo-500
        "#14B8A6", // teal-500
      ];

      // Simple hash function to get a consistent color for a user
      let hash = 0;
      for (let i = 0; i < identifier.length; i++) {
        hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
      }

      return colors[Math.abs(hash) % colors.length];
    };

    return {
      sizeClasses,
      statusClasses,
      getInitials,
      getAvatarColor,
    };
  },
};
</script>
