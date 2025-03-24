<template>
  <div class="container">
    <h1>Ajouter un emploi</h1>
    <JobForm :initialJob="defaultJob" @submit="addJob" />
  </div>
</template>

<script>
import JobForm from "../components/JobForm.vue";

export default {
  name: "AddJob",
  components: {
    JobForm,
  },
  data() {
    return {
      defaultJob: {
        titre: "",
        description: "",
        salaire: 0,
        experience: 0,
        location: "",
        type: "CDI",
        dateCreation: new Date().toISOString().split("T")[0],
      },
    };
  },
  methods: {
    async addJob(jobData) {
      try {
        const response = await fetch("http://localhost:3001/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...jobData,
            dateCreation: new Date().toISOString().split("T")[0],
          }),
        });

        if (!response.ok) throw new Error("Failed to create job");

        const newJob = await response.json();
        this.$router.push(`/jobs/${newJob.id}`);
      } catch (error) {
        console.error("Error:", error);
        alert("Une erreur est survenue lors de la création de l'emploi");
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #2c3e50;
}
</style>
