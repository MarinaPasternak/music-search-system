<template>
  <div class="secation">
    <header-component></header-component>
    <div class="main-section">
      <sign-in-form></sign-in-form>
      <sign-up-form></sign-up-form>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import SignUpForm from "./views/signUp/SignUpForm.vue";
import SignInForm from "./views/signIn/SignInForm.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    SignUpForm,
    SignInForm,
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
