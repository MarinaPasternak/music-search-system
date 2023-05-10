<template>
  <div class="music-search-container">
    <h1 class="gradient-title">{{ fullName }}</h1>
    <music-search :passedQuery="passedQuery"></music-search>
    <liked-songs-component></liked-songs-component>
    <!-- <recomended-songs-component></recomended-songs-component> -->
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
// import RecomendedSongsComponent from "./components/RecomendedSongsComponent.vue";

export default {
  name: "HomeComponent",
  components: {
    TopTracksChartComponent,
    TopArtistComponent,
    TopTagsComponent,
    MusicSearch,
    LikedSongsComponent,
    // RecomendedSongsComponent,
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

<!-- <template>
  <div>
    <h2>Recommended Songs</h2>
    <ul>
      <li v-for="song in recommendedSongs" :key="song.name">
        {{ song.name }} by {{ song.artist }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
// import { getScoreDescription } from "@/utils/rules";

const rules = {
  affective: [
    { score: 0, description: "Sad" },
    { score: 5, description: "Neutral" },
    { score: 10, description: "Happy" },
  ],
  structural: [
    { score: 0, description: "Simple" },
    { score: 5, description: "Balanced" },
    { score: 10, description: "Complex" },
  ],
  kinesthetic: [
    { score: 0, description: "Still" },
    { score: 5, description: "Moderate" },
    { score: 10, description: "Dynamic" },
  ],
};

const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

export default {
  data() {
    return {
      recommendedSongs: [],
    };
  },
  methods: {
    async getRecommendedSongs() {
      const response = await axios.get("https://ws.audioscrobbler.com/2.0/", {
        params: {
          method: "track.getSimilar",
          artist: "Radiohead", // replace with user input
          track: "Paranoid Android", // replace with user input
          api_key: API_KEY,
          format: "json",
        },
      });

      const recommendedSongs = response.data.similartracks.track.map(
        (track) => {
          const { name, artist } = track;
          const {
            affective = 5,
            structural = 5,
            kinesthetic = 5,
          } = track.recommendation || {};
          return {
            name,
            artist,
            affective: {
              score: affective,
              description: rules.affective,
            },
            structural: {
              score: structural,
              description: rules.structural,
            },
            kinesthetic: {
              score: kinesthetic,
              description: rules.kinesthetic,
            },
          };
        }
      );

      console.log(recommendedSongs);

      this.recommendedSongs = recommendedSongs;
    },
    getQueryParams() {
      const affective = parseInt(this.affectiveInput);
      const structural = parseInt(this.structuralInput);
      const kinesthetic = parseInt(this.kinestheticInput);

      return { affective, structural, kinesthetic };
    },
  },
  created() {
    this.getRecommendedSongs();
  },
};
</script> -->
