<template>
  <div class="filter-nav">
    <input
      type="text"
      v-model="filters.location"
      placeholder="Filtrer par ville"
      @input="emitFilters"
    />
    <select v-model="filters.type" @change="emitFilters">
      <option value="">Tous les types</option>
      <option value="CDI">CDI</option>
      <option value="CDD">CDD</option>
      <option value="Stage">Stage</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FilterNav",
  data() {
    return {
      filters: {
        location: "",
        type: "",
      },
    };
  },
  methods: {
    emitFilters() {
      this.$emit("filter-change", { ...this.filters });
    },
  },
};
</script>

<style scoped>
.filter-nav {
  display: flex;
  gap: 1rem;
}

input,
select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}
</style>
