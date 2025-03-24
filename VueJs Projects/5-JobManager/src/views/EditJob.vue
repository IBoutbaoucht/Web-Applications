<template>
  <div class="container">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <template v-else>
      <h1>Modifier l'emploi</h1>
      <form v-if="job" class="edit-form" @submit.prevent>
        <div class="form-group">
          <label for="titre">Titre</label>
          <input
            type="text"
            id="titre"
            v-model="job.titre"
            @input="autoSave"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="job.description"
            @input="autoSave"
            class="form-control"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="salaire">Salaire</label>
          <input
            type="number"
            id="salaire"
            v-model.number="job.salaire"
            @input="autoSave"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="experience">Expérience (années)</label>
          <input
            type="number"
            id="experience"
            v-model.number="job.experience"
            @input="autoSave"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="location">Localisation</label>
          <input
            type="text"
            id="location"
            v-model="job.location"
            @input="autoSave"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="type">Type d'emploi</label>
          <select
            id="type"
            v-model="job.type"
            @change="autoSave"
            class="form-control"
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
            <option value="Stage">Stage</option>
          </select>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
export default {
  name: "EditJob",
  data() {
    return {
      job: null,
      loading: true,
      error: null,
      saveTimeout: null,
    };
  },
  methods: {
    async fetchJob() {
      this.loading = true;
      this.error = null;
      const id = this.$route.params.id;

      try {
        const response = await fetch(`http://localhost:3001/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Job not found");
        }
        this.job = await response.json();
      } catch (error) {
        console.error("Error:", error);
        this.error = "Impossible de charger les détails de l'emploi";
      } finally {
        this.loading = false;
      }
    },
    autoSave() {
      // Clear any existing timeout
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }

      // Set a new timeout to save after 500ms of no changes
      this.saveTimeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/jobs/${this.$route.params.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...this.job,
                salaire: Number(this.job.salaire),
                experience: Number(this.job.experience),
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update job");
          }

          await response.json();
        } catch (error) {
          console.error("Error:", error);
          this.error = "Une erreur est survenue lors de la mise à jour";
        }
      }, 500);
    },
  },
  created() {
    this.fetchJob();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.edit-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

select.form-control {
  background-color: white;
}
</style>
