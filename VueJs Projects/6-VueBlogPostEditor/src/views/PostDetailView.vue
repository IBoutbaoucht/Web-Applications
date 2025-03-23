<template>
  <div class="post-detail">
    <div class="content">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <article v-else class="post">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <router-link
            :to="{ name: 'EditPost', params: { id: post.id } }"
            class="edit-btn"
          >
            Edit Post
          </router-link>
        </div>
        <div class="post-tags">
          <router-link
            v-for="tag in post.tags"
            :key="tag"
            :to="{ path: `/tags/${tag}` }"
            class="tag"
          >
            #{{ tag }}
          </router-link>
        </div>
        <div class="post-content">{{ post.body }}</div>
      </article>
    </div>
    <aside class="sidebar">
      <TagCloud />
    </aside>
  </div>
</template>

<script>
import { usePost } from "@/composables/getPosts";
import TagCloud from "@/components/TagCloud.vue";
import { useRoute } from "vue-router";

export default {
  name: "PostDetailView",
  components: {
    TagCloud,
  },
  setup() {
    const route = useRoute();
    const id = parseInt(route.params.id);
    const { post, error, loading } = usePost(id);

    return {
      post,
      error,
      loading,
    };
  },
};
</script>

<style scoped>
.post-detail {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .post-detail {
    grid-template-columns: 1fr;
  }
}

.content {
  min-width: 0;
}

.sidebar {
  min-width: 0;
}

.post {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-title {
  color: #333;
  margin: 0;
}

.edit-btn {
  display: inline-block;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  text-decoration: none;
  color: #666;
  background-color: #f8f9fa;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: #007bff;
  color: white;
}

.post-content {
  line-height: 1.6;
  color: #444;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style>
