<template>
  <div class="edit-post">
    <h1>Edit Post</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="loading" class="loading">Loading...</div>
    <form v-else @submit.prevent="handleSubmit" class="post-form">
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

      <div class="button-group">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? "Saving..." : "Save Changes" }}
        </button>
        <button
          type="button"
          class="delete-btn"
          :disabled="isSubmitting"
          @click="handleDelete"
        >
          {{ isDeleting ? "Deleting..." : "Delete Post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePost, updatePost, deletePost } from "@/composables/getPosts";

export default {
  name: "EditPostView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const id = route.params.id;

    const title = ref("");
    const body = ref("");
    const tagsInput = ref("");
    const error = ref("");
    const isSubmitting = ref(false);
    const isDeleting = ref(false);

    const { post, error: fetchError, loading } = usePost(id);

    watch(
      post,
      (newPost) => {
        if (newPost) {
          title.value = newPost.title;
          body.value = newPost.body;
          tagsInput.value = newPost.tags.join(", ");
        }
      },
      { immediate: true }
    );

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

        await updatePost(id, postData);
        router.push(`/post/${id}`);
      } catch (err) {
        error.value = err.message;
      } finally {
        isSubmitting.value = false;
      }
    };

    const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this post?")) return;

      isDeleting.value = true;
      error.value = "";

      try {
        await deletePost(id);
        router.push("/");
      } catch (err) {
        error.value = err.message;
        isDeleting.value = false;
      }
    };

    return {
      title,
      body,
      tagsInput,
      error: error.value || fetchError.value,
      loading,
      isSubmitting,
      isDeleting,
      handleSubmit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.edit-post {
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

.button-group {
  display: flex;
  gap: 1rem;
}

.submit-btn,
.delete-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.submit-btn:disabled,
.delete-btn:disabled {
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

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
