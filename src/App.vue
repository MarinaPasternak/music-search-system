<template>
  <div>
    <header-component></header-component>
    <Button icon="pi pi-check" aria-label="Submit" />
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

import Button from "primevue/button";
export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    Button,
  },
};
</script>

<style lang="scss" scoped></style>
