<template>
  <div v-if="topTracks">
    <div class="chart-container">
      <h2 class="gradient-title">Top 50 Global</h2>
      <div class="flex-container">
        <track-card
          v-for="(track, index) in pagedTopTracks"
          :key="track.url"
          :postionInChart="index + offset + 1"
          :trackName="track.name"
          :artistName="track.artist.name"
        ></track-card>
      </div>
      <Paginator
        class="paginator"
        :first="offset"
        :rows="10"
        :totalRecords="topTracks.length"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        @page="onPageChangeHandler"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TrackCard from "@/components/TrackCard.vue";
import Paginator from "primevue/paginator";
export default {
  name: "TopTracksChartComponent",
  components: {
    TrackCard,
    Paginator,
  },
  data() {
    return {
      offset: 0,
      rowsPerPage: 10,
    };
  },
  computed: {
    ...mapState({
      topTracks: (state) => state.topTracks.topTracks,
    }),
    pagedTopTracks() {
      return this.topTracks.slice(this.offset, this.offset + this.rowsPerPage);
    },
  },
  methods: {
    ...mapActions(["fetchTopTracks"]),
    onPageChangeHandler(event) {
      this.offset = event.first;
      this.pageSize = event.rows;
    },
  },
  mounted() {
    this.fetchTopTracks();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.flex-container {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

.chart-container {
  margin-bottom: 130px;
  padding-bottom: 130px;

  h2 {
    margin-top: 3rem;
  }
}

.paginator {
  width: fit-content;
  margin: auto;
}
</style>
