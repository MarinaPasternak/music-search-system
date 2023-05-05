<template>
  <div class="track-card" v-if="track" @click="rediractOnTrackInformation">
    <p>{{ postionInChart }}.</p>
    <template v-if="track.album && track.album.image[0]['#text']">
      <img :src="track.album.image[0]['#text']" :alt="track.name" />
    </template>
    <template v-else>
      <div class="color-square"></div>
    </template>
    <div class="track-information">
      <h4>
        <span
          ><a :href="track.artist.url">{{ artistName }}</a></span
        >
        - {{ track.name }}
      </h4>
      <div class="track-description">
        <p>{{ playcountCut }}</p>
        <badge v-for="tagName in topTags" :key="tagName" :value="tagName" />
      </div>
    </div>
  </div>
</template>

<script>
import Badge from "primevue/badge";
import axios from "axios";
const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

export default {
  name: "TrackCard",
  props: ["trackName", "artistName", "postionInChart", "trackSearched"],
  components: {
    Badge,
  },
  data() {
    return {
      track: null,
    };
  },
  computed: {
    playcountCut() {
      if (this.track.playcount >= 1000000000) {
        return (
          (this.track.playcount / 1000000000).toFixed(1).replace(/\.0$/, "") +
          "B"
        );
      }
      if (this.track.playcount >= 1000000) {
        return (
          (this.track.playcount / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
        );
      }
      if (this.track.playcount >= 1000) {
        return (
          (this.track.playcount / 1000).toFixed(1).replace(/\.0$/, "") + "K"
        );
      }

      return this.track.playcount;
    },
    topTags() {
      if (this.track.toptags.tag.length === 0) {
        return ["no tags rigth now"];
      }
      return this.track.toptags.tag.map((item) => item.name);
    },
  },
  methods: {
    async fetchTrackInformation() {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${this.artistName}&track=${this.trackName}&format=json`
      );

      this.track = response.data.track;
    },
    rediractOnTrackInformation() {
      this.$router.push({
        name: "song",
        params: { artist: this.artistName, song: this.track.name },
      });
    },
  },
  created() {
    if (!this.trackSearched) {
      this.fetchTrackInformation();
    } else {
      this.track = this.trackSearched;
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.track-card {
  display: flex;
  margin-bottom: 1rem;
  cursor: pointer;

  p {
    width: 20px;
  }

  img {
    width: 60px;
    margin: 0 1.5rem;
  }

  h4 a:hover {
    color: $primary-color;
  }
}

.track-description {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  color: $white-color;

  p {
    width: 50px;
    margin: 0 1rem;
  }

  .p-badge {
    margin: 0 5px;
  }
}

.color-square {
  height: 60px;
  width: 60px;
  margin: 0 1.5rem;
  background-color: $secondary-color;
}
</style>
