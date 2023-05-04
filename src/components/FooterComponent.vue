<template>
  <div class="footer"><p>2023</p></div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 1rem;
  background-color: $secondary-color;
  z-index: 10000;

  p {
    margin: 0;
  }
}
</style>
