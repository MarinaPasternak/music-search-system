<template>
  <div class="secation">
    <header-component></header-component>
    <div class="main-section">
      <log-in-form></log-in-form>
      <registration-form></registration-form>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import RegistrationForm from "./views/registration/RegistrationForm.vue";
import LogInForm from "./views/logIn/LogInForm.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    RegistrationForm,
    LogInForm,
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
