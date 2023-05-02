<template>
  <div class="top-artist-container">
    <h2 class="gradient-title">Top 10 Artists</h2>
    <div class="flex-container" v-if="topArtists">
      <div
        v-for="(artist, index) in topArtists"
        :key="index"
        class="artist-information"
      >
        <a :href="artist.url"
          ><img :src="artist.image[2]['#text']" :alt="artist.name"
        /></a>
        <a :href="artist.url">
          <h3>
            <span>{{ index + 1 }}. </span>{{ artist.name }}
          </h3>
        </a>
        <p>Played: {{ playcountCut(artist.playcount) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState({
      topArtists: (state) => state.topArtists.topArtists,
    }),
  },
  methods: {
    ...mapActions(["fetchTopArtists"]),
    playcountCut(artistPlaycount) {
      if (artistPlaycount >= 1000000000) {
        return (
          (artistPlaycount / 1000000000).toFixed(1).replace(/\.0$/, "") + "B"
        );
      }
      if (artistPlaycount >= 1000000) {
        return (artistPlaycount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
      }
      if (artistPlaycount >= 1000) {
        return (artistPlaycount / 1000).toFixed(1).replace(/\.0$/, "") + "K";
      }

      return artistPlaycount;
    },
  },
  created() {
    this.fetchTopArtists();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.top-artist-container {
  margin: 2rem 0;
}

.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .artist-information {
    margin: 1rem;

    span,
    h3 {
      color: $primary-color;
    }

    a {
      color: $primary-color;
    }

    a:hover,
    h3:hover {
      color: $purple-color;
    }

    img {
      margin-bottom: 15px;
    }
  }
}
</style>
