<template>
  <div class="create-post">
    <h1>Create New Post</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <form @submit.prevent="handleSubmit" class="post-form">
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          type="text"
          id="title"
          v-model="title"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="body">Content:</label>
        <textarea
          id="body"
          v-model="body"
          required
          class="form-control"
          rows="10"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tags">Tags (comma separated):</label>
        <input
          type="text"
          id="tags"
          v-model="tagsInput"
          class="form-control"
          placeholder="vue, javascript, web"
        />
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Creating..." : "Create Post" }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createPost } from "@/composables/getPosts";

export default {
  name: "CreatePostView",
  setup() {
    const router = useRouter();
    const title = ref("");
    const body = ref("");
    const tagsInput = ref("");
    const error = ref("");
    const isSubmitting = ref(false);

    const handleSubmit = async () => {
      error.value = "";
      isSubmitting.value = true;

      try {
        const tags = tagsInput.value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        const postData = {
          title: title.value,
          body: body.value,
          tags,
        };

        await createPost(postData);
        router.push("/");
      } catch (err) {
        error.value = err.message;
        isSubmitting.value = false;
      }
    };

    return {
      title,
      body,
      tagsInput,
      error,
      isSubmitting,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.create-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
}

.post-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea.form-control {
  resize: vertical;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #dc3545;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}
</style>
