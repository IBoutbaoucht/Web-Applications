<template>
  <div class="home">
    <div class="content">
      <div v-if="selectedTag" class="selected-tag">
        Showing posts tagged with :
        <span class="tag-name"> #{{ selectedTag }}</span>
        <button @click="clearTag" class="clear-tag">×</button>
      </div>
      <PostList :filter-tag="selectedTag" />
    </div>
    <aside class="sidebar">
      <TagCloud @tag-selected="onTagSelected" />
    </aside>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import TagCloud from "@/components/TagCloud.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "HomeView",
  components: {
    PostList,
    TagCloud,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const selectedTag = ref("");

    const onTagSelected = (tag) => {
      selectedTag.value = tag;
      router.push(`/tags/${tag}`);
    };

    const clearTag = () => {
      selectedTag.value = "";
      router.push("/");
    };

    onMounted(() => {
      if (route.params.tag) {
        selectedTag.value = route.params.tag;
      }
    });

    return {
      selectedTag,
      onTagSelected,
      clearTag,
    };
  },
};
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .home {
    grid-template-columns: 1fr;
  }
}

.content {
  min-width: 0;
}

.sidebar {
  min-width: 0;
}

.selected-tag {
  background-color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tag-name {
  color: #007bff;
  font-weight: 500;
}

.clear-tag {
  margin-left: auto;
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.clear-tag:hover {
  color: #dc3545;
}
</style>
