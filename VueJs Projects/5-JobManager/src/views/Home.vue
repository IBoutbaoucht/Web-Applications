<template>
  <div class="container">
    <div class="header">
      <h1>Liste des Emplois</h1>
      <router-link to="/add" class="add-btn">Ajouter un emploi</router-link>
    </div>

    <FilterNav @filter-change="applyFilters" />

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="filteredJobs.length === 0" class="no-jobs">
      Aucun emploi trouvé
    </div>
    <div v-else class="jobs-grid">
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <h2>{{ job.titre }}</h2>
        <p class="location">📍 {{ job.location }}</p>
        <p class="salary">💰 {{ job.salaire }} DH</p>
        <p class="experience">👨‍💼 {{ job.experience }} ans d'expérience</p>
        <p class="type">🕒 {{ job.type }}</p>
        <div class="actions">
          <router-link :to="`/jobs/${job.id}`" class="btn view">
            Voir détails
          </router-link>
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
      loading: true,
      error: null,
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
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("http://localhost:3001/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        this.jobs = await response.json();
      } catch (error) {
        console.error("Error:", error);
        this.error = "Impossible de charger les emplois";
      } finally {
        this.loading = false;
      }
    },
    applyFilters(filters) {
      this.filters = filters;
    },
  },
  created() {
    this.fetchJobs();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading,
.error,
.no-jobs {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
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
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.view {
  background-color: #3498db;
  color: white;
}

.view:hover {
  background-color: #2980b9;
}

.add-btn {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.no-jobs {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
