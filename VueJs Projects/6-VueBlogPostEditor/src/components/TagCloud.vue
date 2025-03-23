<template>
  <div class="tag-cloud">
    <h3 class="title">Popular Tags</h3>
    <div class="tags-container">
      <button
        v-for="tag in uniqueTags"
        :key="tag"
        @click="$emit('tag-selected', tag)"
        class="tag"
      >
        #{{ tag }}
        <span class="count">({{ getTagCount(tag) }})</span>
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { usePosts } from "@/composables/getPosts";

export default {
  name: "TagCloud",
  emits: ["tag-selected"],
  setup() {
    const { posts } = usePosts();

    const uniqueTags = computed(() => {
      const tags = posts.value.reduce((acc, post) => {
        return [...acc, ...post.tags];
      }, []);
      return [...new Set(tags)];
    });

    const getTagCount = (tag) => {
      return posts.value.filter((post) => post.tags.includes(tag)).length;
    };

    return {
      uniqueTags,
      getTagCount,
    };
  },
};
</script>

<style scoped>
.tag-cloud {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.title {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  text-decoration: none;
  color: #666;
  background-color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.tag:hover {
  background-color: #007bff;
  color: white;
}

.count {
  font-size: 0.8rem;
  margin-left: 0.2rem;
}
</style>
