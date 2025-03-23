<template>
  <div class="post-card">
    <h2 class="post-title">{{ post.title }}</h2>
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
    <p class="post-snippet">{{ snippet }}</p>
    <router-link :to="{ path: `/post/${post.id}` }" class="read-more">
      Read more...
    </router-link>
  </div>
</template>

<script>
export default {
  name: "SinglePost",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    snippet() {
      return this.post.body.substring(0, 50) + "...";
    },
  },
};
</script>

<style scoped>
.post-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
}

.post-title {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  text-decoration: none;
  color: #666;
  font-size: 0.9rem;
}

.tag:hover {
  color: #333;
}

.post-snippet {
  color: #666;
  margin: 0.5rem 0;
}

.read-more {
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}
</style>
