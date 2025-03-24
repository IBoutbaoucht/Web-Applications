<template>
  <div class="container">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <template v-else>
      <h1>Modifier l'emploi</h1>
      <JobForm
        v-if="job"
        :initialJob="job"
        :isEdit="true"
        @submit="updateJob"
      />
    </template>
  </div>
</template>

<script>
import JobForm from "../components/JobForm.vue";

export default {
  name: "EditJob",
  components: {
    JobForm,
  },
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
    async updateJob(updatedJob) {
      try {
        // Keep the original job data and only update the fields that should change
        const jobToUpdate = {
          ...this.job, // Keep existing data
          titre: updatedJob.titre || this.job.titre,
          description: updatedJob.description || this.job.description,
          salaire: Number(updatedJob.salaire) || this.job.salaire,
          experience: Number(updatedJob.experience) || this.job.experience,
          location: updatedJob.location || this.job.location,
          type: updatedJob.type || this.job.type,
          dateCreation: this.job.dateCreation, // Keep original creation date
        };

        const response = await fetch(
          `http://localhost:3001/jobs/${this.$route.params.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jobToUpdate),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update job");
        }

        await response.json();
        this.$router.push(`/jobs/${this.$route.params.id}`);
      } catch (error) {
        console.error("Error:", error);
        alert("Une erreur est survenue lors de la mise à jour");
      }
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
</style>
