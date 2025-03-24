<template>
  <div class="container">
    <div class="header">
      <h1>Liste des Emplois</h1>
      <p class="job-count" v-if="!loading && !error">
        {{ filteredJobs.length }} offre{{
          filteredJobs.length !== 1 ? "s" : ""
        }}
        disponible{{ filteredJobs.length !== 1 ? "s" : "" }}
      </p>
    </div>

    <FilterNav @filter-change="applyFilters" />

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>Chargement des offres...</p>
    </div>
    <div v-else-if="error" class="error">
      <span class="error-icon">⚠️</span>
      {{ error }}
    </div>
    <div v-else-if="filteredJobs.length === 0" class="no-jobs">
      <span class="no-jobs-icon">🔍</span>
      <p>Aucun emploi trouvé</p>
      <p class="no-jobs-subtitle">
        Essayez de modifier vos critères de recherche
      </p>
    </div>
    <div v-else class="jobs-grid">
      <div v-for="job in sortedJobs" :key="job.id" class="job-card">
        <div class="job-card-content">
          <h2>{{ job.titre }}</h2>
          <div class="job-info">
            <p class="location">
              <span class="icon">📍</span> {{ job.location }}
            </p>
            <p class="salary">
              <span class="icon">💰</span> {{ formatSalary(job.salaire) }} DH
            </p>
            <p class="experience">
              <span class="icon">👨‍💼</span> {{ job.experience }} ans d'expérience
            </p>
            <p class="type"><span class="icon">🕒</span> {{ job.type }}</p>
          </div>
          <div class="actions">
            <router-link :to="`/jobs/${job.id}`" class="btn view">
              Voir détails
            </router-link>
          </div>
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
        sortBy: "date",
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
        return locationMatch;
      });
    },
    sortedJobs() {
      const jobs = [...this.filteredJobs];
      switch (this.filters.sortBy) {
        case "salary-desc":
          return jobs.sort((a, b) => b.salaire - a.salaire);
        case "salary-asc":
          return jobs.sort((a, b) => a.salaire - b.salaire);
        case "experience":
          return jobs.sort((a, b) => b.experience - a.experience);
        case "date":
        default:
          return jobs.sort(
            (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
          );
      }
    },
  },
  methods: {
    formatSalary(salary) {
      return new Intl.NumberFormat("fr-FR").format(salary);
    },
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
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.job-count {
  color: #666;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem;
  background-color: #fee;
  border-radius: 8px;
  color: #e74c3c;
  font-size: 1.1rem;
}

.error-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.job-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.job-card-content {
  padding: 1.5rem;
}

.job-card h2 {
  color: #2c3e50;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
  line-height: 1.4;
}

.job-info {
  display: grid;
  gap: 0.8rem;
}

.job-info p {
  display: flex;
  align-items: center;
  color: #666;
  margin: 0;
}

.icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.actions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.view {
  background-color: #3498db;
  color: white;
  width: 100%;
  text-align: center;
}

.view:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.no-jobs {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-jobs-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.no-jobs p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.no-jobs-subtitle {
  color: #999;
  font-size: 1rem !important;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .jobs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
