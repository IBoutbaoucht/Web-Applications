<template>
  <div class="container">
    <div class="header">
      <h1>Liste des Emplois</h1>
      <FilterNav @filter-change="applyFilters" />
    </div>

    <div class="jobs-grid">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <h2>{{ job.titre }}</h2>
        <p class="location">📍 {{ job.location }}</p>
        <p class="salary">💰 {{ job.salaire }} DH</p>
        <p class="experience">👨‍💼 {{ job.experience }} ans d'expérience</p>
        <div class="actions">
          <router-link :to="'/jobs/' + job.id" class="btn view"
            >Voir détails</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FilterNav from "../components/FilterNav.vue";

export default {
  name: "HomeView",
  components: {
    FilterNav,
  },
  data() {
    return {
      jobs: [],
      filters: {
        location: "",
        type: "",
      },
    };
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter((job) => {
        const locationMatch =
          !this.filters.location ||
          job.location
            .toLowerCase()
            .includes(this.filters.location.toLowerCase());
        const typeMatch = !this.filters.type || job.type === this.filters.type;
        return locationMatch && typeMatch;
      });
    },
  },
  methods: {
    async fetchJobs() {
      try {
        const res = await fetch("http://localhost:3000/jobs");
        this.jobs = await res.json();
      } catch (error) {
        console.error("Erreur:", error);
      }
    },
    applyFilters(filters) {
      this.filters = filters;
    },
  },
  mounted() {
    this.fetchJobs();
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.job-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.job-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.location,
.salary,
.experience {
  margin: 0.5rem 0;
  color: #666;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.view {
  background-color: #3498db;
  color: white;
}
</style>
