<template>
  <form @submit.prevent="handleSubmit" class="job-form">
    <div class="form-group">
      <label for="titre">Titre</label>
      <input type="text" id="titre" v-model="formData.titre" required />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        required
      ></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="salaire">Salaire (DH)</label>
        <input
          type="number"
          id="salaire"
          v-model.number="formData.salaire"
          required
        />
      </div>

      <div class="form-group">
        <label for="experience">Années d'expérience</label>
        <input
          type="number"
          id="experience"
          v-model.number="formData.experience"
          required
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="location">Ville</label>
        <input type="text" id="location" v-model="formData.location" required />
      </div>

      <div class="form-group">
        <label for="type">Type de contrat</label>
        <select id="type" v-model="formData.type" required>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
        </select>
      </div>
    </div>

    <button type="submit" class="submit-btn">
      {{ isEdit ? "Modifier" : "Ajouter" }}
    </button>
  </form>
</template>

<script>
export default {
  name: "JobForm",
  props: {
    initialJob: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        titre: "",
        description: "",
        salaire: 0,
        experience: 0,
        location: "",
        type: "CDI",
      },
    };
  },
  watch: {
    initialJob: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            titre: newVal.titre,
            description: newVal.description,
            salaire: Number(newVal.salaire),
            experience: Number(newVal.experience),
            location: newVal.location,
            type: newVal.type,
          };
        }
      },
    },
  },
  methods: {
    handleSubmit() {
      if (
        !this.formData.titre ||
        !this.formData.description ||
        !this.formData.location ||
        !this.formData.type ||
        this.formData.salaire <= 0 ||
        this.formData.experience < 0
      ) {
        alert("Veuillez remplir tous les champs correctement");
        return;
      }

      this.$emit("submit", { ...this.formData });
    },
  },
};
</script>

<style scoped>
.job-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 150px;
  resize: vertical;
}

.submit-btn {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
}

.submit-btn:hover {
  background-color: #3aa876;
}
</style>
