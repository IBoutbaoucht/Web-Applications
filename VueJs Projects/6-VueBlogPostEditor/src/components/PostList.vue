<template>
  <div class="post-list">
    <h1 class="title">{{ title }}</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="filteredPosts.length === 0" class="no-posts">
      No posts found{{ filterTag ? ` with tag #${filterTag}` : "" }}
    </div>
    <div v-else class="posts-container">
      <SinglePost v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script>
import SinglePost from "./SinglePost.vue";
import { usePosts } from "@/composables/getPosts";
import { computed } from "vue";

export default {
  name: "PostList",
  components: {
    SinglePost,
  },
  props: {
    filterTag: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { posts, error, loading } = usePosts();

    const filteredPosts = computed(() => {
      if (!props.filterTag) return posts.value;
      return posts.value.filter((post) => post.tags.includes(props.filterTag));
    });

    const title = computed(() => {
      if (props.filterTag) {
        return `Posts tagged with #${props.filterTag}`;
      }
      return "Latest Posts";
    });

    return {
      filteredPosts,
      error,
      loading,
      title,
    };
  },
};
</script>

<style scoped>
.post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  color: #333;
  margin-bottom: 2rem;
}

.loading,
.error,
.no-posts {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
