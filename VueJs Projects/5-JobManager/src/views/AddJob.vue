<template>
  <div class="container">
    <h1>Ajouter un emploi</h1>
    <form class="edit-form" @submit.prevent="addJob">
      <div class="form-group">
        <label for="titre">Titre</label>
        <input
          type="text"
          id="titre"
          v-model="job.titre"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="job.description"
          class="form-control"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="salaire">Salaire</label>
        <input
          type="number"
          id="salaire"
          v-model.number="job.salaire"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="experience">Expérience (années)</label>
        <input
          type="number"
          id="experience"
          v-model.number="job.experience"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="location">Localisation</label>
        <input
          type="text"
          id="location"
          v-model="job.location"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="type">Type d'emploi</label>
        <select id="type" v-model="job.type" class="form-control" required>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Freelance">Freelance</option>
          <option value="Stage">Stage</option>
        </select>
      </div>

      <button type="submit" class="submit-button">Ajouter l'emploi</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddJob",
  data() {
    return {
      job: {
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
    async addJob() {
      try {
        const response = await fetch("http://localhost:3001/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...this.job,
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

.submit-button {
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #2980b9;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
</style>
