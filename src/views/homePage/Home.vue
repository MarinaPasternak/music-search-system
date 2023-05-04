<template>
  <div class="music-search-container">
    <h1 class="gradient-title">{{ fullName }}</h1>
    <music-search></music-search>
    <top-artist-component></top-artist-component>
    <top-tags-component></top-tags-component>
    <top-tracks-chart-component></top-tracks-chart-component>
  </div>
</template>

<script>
import { auth } from "../../firebase/init";

import TopTracksChartComponent from "./components/TopTracksChartComponent.vue";
import TopArtistComponent from "./components/TopArtistComponent.vue";
import TopTagsComponent from "./components/TopTagsComponent.vue";
import MusicSearch from "../musicSearch/MusicSearch.vue";

export default {
  name: "HomeComponent",
  components: {
    TopTracksChartComponent,
    TopArtistComponent,
    TopTagsComponent,
    MusicSearch,
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
