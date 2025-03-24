<template>
  <div class="sort-nav">
    <div class="search-box">
      <i class="search-icon">🔍</i>
      <input
        type="text"
        v-model="filters.location"
        placeholder="Rechercher par ville..."
        @input="emitFilters"
        class="search-input"
      />
    </div>
    <div class="sort-options">
      <label>Trier par:</label>
      <select v-model="sortOption" @change="emitSort" class="sort-select">
        <option value="date">Date de création</option>
        <option value="salary-desc">Salaire (Plus élevé)</option>
        <option value="salary-asc">Salaire (Plus bas)</option>
        <option value="experience">Expérience requise</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "SortNav",
  data() {
    return {
      filters: {
        location: "",
      },
      sortOption: "date",
    };
  },
  methods: {
    emitFilters() {
      this.$emit("filter-change", {
        ...this.filters,
        sortBy: this.sortOption,
      });
    },
    emitSort() {
      this.emitFilters();
    },
  },
};
</script>

<style scoped>
.sort-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-options label {
  color: #666;
  font-weight: 500;
}

.sort-select {
  padding: 0.8rem 2rem 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  min-width: 200px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;
}

.sort-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

@media (max-width: 768px) {
  .sort-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    max-width: 100%;
  }

  .sort-options {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .sort-select {
    width: 100%;
  }
}
</style>
