<template>
  <div class="loading-component">
    <ProgressSpinner style="width: 50px; height: 50px"></ProgressSpinner>
    <h2 class="gradient-title">Wait a second it`s loading...</h2>
  </div>
</template>

<script>
import ProgressSpinner from "primevue/progressspinner";
export default {
  name: "LoadingComponent",
  components: {
    ProgressSpinner,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.loading-component {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;

  h2 {
    margin-left: 1rem;
  }
}

::v-deep div.p-progress-spinner {
  margin: 0;
}
</style>
