<template>
  <div v-if="topTracks">
    <div class="cart-container">
      <h2 class="gradient-title">Top 50 Global</h2>
      <div clas="flex-container">
        <track-card
          v-for="(track, index) in topTracks"
          :key="index"
          :postionInChart="index"
          :track="track"
        ></track-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import TrackCard from "@/components/TrackCard.vue";
export default {
  name: "TopTracksChartComponent",
  components: {
    TrackCard,
  },
  computed: {
    ...mapState({
      topTracks: (state) => state.topTracks.topTracks,
    }),
  },
  methods: {
    ...mapActions(["fetchTopTracks"]),
  },
  mounted() {
    this.fetchTopTracks();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";
</style>
