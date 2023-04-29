<template>
  <div>
    <div class="not-found">
      <h1 class="gradient-title">Oops! Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <router-link to="/">
        <button class="primary-button">Home page</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 2rem;

  .primary-button:hover {
    background-color: $black-color;
  }
}
</style>
