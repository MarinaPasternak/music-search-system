<template>
  <div class="secation">
    <header-component></header-component>
    <div class="main-section">
      <router-view />
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
};
</script>

<style lang="scss" scoped>
.secation {
  position: absolute;
  width: 100%;
  height: 100%;
}
.main-section {
  padding: 1rem;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-content: center;
}
</style>
