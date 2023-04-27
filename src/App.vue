<template>
  <div>
    <header-component></header-component>
    <div class="main-section">
      <Button icon="pi pi-check" aria-label="Submit" />
      <p>{{ message }}</p>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

import Button from "primevue/button";
import axios from "axios";
export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
    Button,
  },
  data() {
    return {
      message: "",
    };
  },
  mounted() {
    axios
      .get("/data")
      .then((response) => {
        this.message = response.data.message;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style lang="scss" scoped>
.main-section {
  padding: 1rem;
}
</style>
