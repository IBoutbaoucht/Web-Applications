<template>
  <div class="container">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else-if="job" class="job-detail">
      <h1>{{ job.titre }}</h1>
      <div class="info">
        <p class="location">📍 {{ job.location }}</p>
        <p class="salary">💰 {{ job.salaire }} DH</p>
        <p class="experience">👨‍💼 {{ job.experience }} ans d'expérience</p>
        <p class="type">🕒 {{ job.type }}</p>
        <p class="date">📅 Créé le: {{ formatDate(job.dateCreation) }}</p>
      </div>
      <div class="description">
        <h2>Description</h2>
        <p>{{ job.description }}</p>
      </div>
      <div class="actions">
        <router-link :to="`/jobs/${job.id}/edit`" class="btn edit"
          >Modifier</router-link
        >
        <button @click="confirmDelete" class="btn delete">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JobDetail",
  data() {
    return {
      job: null,
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchJob() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch(
          `http://localhost:3001/jobs/${this.$route.params.id}`
        );
        if (!res.ok) {
          throw new Error("Emploi non trouvé");
        }
        this.job = await res.json();
      } catch (error) {
        console.error("Erreur:", error);
        this.error = "Impossible de charger les détails de l'emploi";
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR");
    },
    async confirmDelete() {
      if (confirm("Êtes-vous sûr de vouloir supprimer cet emploi ?")) {
        try {
          const res = await fetch(`http://localhost:3001/jobs/${this.job.id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            throw new Error("Échec de la suppression");
          }
          this.$router.push("/");
        } catch (error) {
          console.error("Erreur:", error);
          alert("Une erreur est survenue lors de la suppression");
        }
      }
    },
  },
  created() {
    this.fetchJob();
  },
  watch: {
    "$route.params.id": {
      handler() {
        this.fetchJob();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.job-detail {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info {
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.description {
  margin: 2rem 0;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

.edit {
  background-color: #f39c12;
  color: white;
  text-decoration: none;
}

.delete {
  background-color: #e74c3c;
  color: white;
}

.location,
.salary,
.experience,
.type,
.date {
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
