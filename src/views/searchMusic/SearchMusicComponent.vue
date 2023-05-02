<template>
  <div class="music-search-container">
    <h1 class="gradient-title">{{ fullName }}</h1>
    <button class="primary-button" @click="redirectToStatisticPage">
      See Statistic
    </button>
    <top-artist-component></top-artist-component>
    <top-tracks-chart-component></top-tracks-chart-component>
  </div>
</template>

<script>
import { auth } from "../../firebase/init";

import TopTracksChartComponent from "./components/TopTracksChartComponent.vue";
import TopArtistComponent from "./components/TopArtistComponent.vue";
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "SearchMusicComponent",
  components: {
    TopTracksChartComponent,
    TopArtistComponent,
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
    redirectToStatisticPage() {
      if (!auth.currentUser) {
        notify({
          type: "error",
          title: "You are not authorised",
          text: "You are redirected to Home page",
        });
      }

      this.$router.push({ path: "/statistic" });
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
