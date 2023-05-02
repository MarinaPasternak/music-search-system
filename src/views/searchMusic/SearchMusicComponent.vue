<template>
  <div class="music-search-container">
    <h1>{{ fullName }}</h1>
    <button class="primary-button">See Statistic</button>
    <top-tracks-chart-component></top-tracks-chart-component>
  </div>
</template>

<script>
import { auth } from "../../firebase/init";

import TopTracksChartComponent from "./components/TopTracksChartComponent.vue";

export default {
  name: "SearchMusicComponent",
  components: {
    TopTracksChartComponent,
  },
  data() {
    return {
      fullName: null,
    };
  },
  methods: {
    checkIfUserSignedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.fullName = `Welcome, ${user.displayName}`;
        } else {
          this.fullName = "Welcome, Dear Guest";
        }
      });
    },
  },
  created() {
    setTimeout(() => {
      this.checkIfUserSignedIn();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.music-search-container {
  width: 100%;
  margin: 2rem;
  margin-top: 130px;

  h1 {
    text-align: center;
  }
}
</style>
