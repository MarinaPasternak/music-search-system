<template>
  <div class="music-search-container">
    <h1 class="gradient-title">{{ fullName }}</h1>
    <music-search :passedQuery="passedQuery"></music-search>
    <liked-songs-component></liked-songs-component>
    <recomended-songs-component></recomended-songs-component>
    <top-artist-component></top-artist-component>
    <top-tags-component @getTagName="searchByTag"></top-tags-component>
    <top-tracks-chart-component></top-tracks-chart-component>
  </div>
</template>

<script>
import { auth, updateUserId } from "../../firebase/init";

import TopTracksChartComponent from "./components/TopTracksChartComponent.vue";
import TopArtistComponent from "./components/TopArtistComponent.vue";
import TopTagsComponent from "./components/TopTagsComponent.vue";
import MusicSearch from "../musicSearch/MusicSearch.vue";
import LikedSongsComponent from "./components/LikedSongsComponent.vue";
import RecomendedSongsComponent from "./components/RecomendedSongsComponent.vue";

export default {
  name: "HomeComponent",
  components: {
    TopTracksChartComponent,
    TopArtistComponent,
    TopTagsComponent,
    MusicSearch,
    LikedSongsComponent,
    RecomendedSongsComponent,
  },
  data() {
    return {
      fullName: null,
      passedQuery: null,
    };
  },
  methods: {
    checkIfUserSignedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          updateUserId(user.uid);
          this.fullName = `Welcome, ${user.displayName}`;
        } else {
          this.fullName = "Welcome, Dear Guest";
        }
      });
    },
    searchByTag(tagName) {
      this.passedQuery = tagName;
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
