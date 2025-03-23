<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/create" class="nav-link">Add Post</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.navbar {
  padding: 1rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link:hover {
  color: #666;
}
</style>
