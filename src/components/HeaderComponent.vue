<template>
  <div class="header">
    <button class="primary-button">Log Out</button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";
.header {
  position: fixed;
  padding: 1rem;
  width: 100%;
  background-color: $secondary-color;

  p {
    margin: 0;
  }
}
</style>
