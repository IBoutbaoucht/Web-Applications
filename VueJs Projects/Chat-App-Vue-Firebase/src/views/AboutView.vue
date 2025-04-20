/* eslint-disable */
<template>
  <div class="container mx-auto p-6 max-w-2xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
      About Chat App
    </h2>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Welcome to the Chat App, a real-time messaging platform built with Vue 3
        and Firebase. This application allows users to engage in private chats,
        create and join group conversations, and share images securely.
      </p>
      <p class="text-gray-600 dark:text-gray-300 mb-4">Features include:</p>
      <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
        <li>Real-time messaging with typing indicators</li>
        <li>User status (online/offline) tracking</li>
        <li>Group chat creation and management</li>
        <li>Image uploads with Firebase Storage</li>
        <li>Push notifications for new messages</li>
      </ul>
      <p class="text-gray-600 dark:text-gray-300">
        Built by [Your Name/Team] using modern web technologies. For support or
        feedback, contact us at
        <a
          href="mailto:support@chatapp.com"
          class="text-blue-500 hover:underline"
          >support@chatapp.com</a
        >.
      </p>
      <router-link
        to="/"
        class="mt-6 inline-block text-blue-500 hover:underline"
        >Back to Chat</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
};
</script>
