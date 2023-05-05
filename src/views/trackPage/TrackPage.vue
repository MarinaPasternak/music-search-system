<template>
  <div class="track-container" v-if="track">
    <h2 class="gradient">{{ songName }}</h2>
    <div class="information-container">
      <div class="image">
        <template v-if="track.album && track.album.image[0]['#text']">
          <img :src="track.album.image[3]['#text']" :alt="track.name" />
        </template>
        <template v-else>
          <div class="color-square"></div>
        </template>
      </div>
      <div class="descrition">
        <a :href="track.artist.url"
          ><h3>{{ artistName }}</h3></a
        >
        <p>{{ playcountCut }}</p>

        <p>Published: {{ track.wiki.published }}</p>
        <div class="summary">
          <p>{{ summeryCut }}</p>
        </div>
        <div class="track-tags">
          <badge v-for="tagName in topTags" :key="tagName" :value="tagName" />
        </div>
        <button class="primary-button" @click="rediractHome">Home Page</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Badge from "primevue/badge";
const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;
export default {
  name: "TrackPage",
  components: {
    Badge,
  },
  data() {
    return {
      track: null,
    };
  },
  computed: {
    songName() {
      return this.$route.params.song;
    },
    artistName() {
      return this.$route.params.artist;
    },
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
    summeryCut() {
      return this.track.wiki.summary.replace(/<a.*?>.*?<\/a>/gi, "");
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
      try {
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${this.artistName}&track=${this.songName}&format=json`
        );

        this.track = response.data.track;
      } catch (error) {
        console.log(error);
      }
    },
    rediractHome() {
      this.$router.push({ path: "/" });
    },
  },
  created() {
    this.fetchTrackInformation();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.track-container {
  width: 80%;
  height: fit-content;
  margin: auto;
  border-radius: 10px;
  background-color: rgb(26, 26, 26);
}

.information-container {
  margin: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  .primary-button {
    width: 60%;
  }
}

.image {
  margin-right: 2rem;
}

a:hover {
  color: $primary-color;
}

h3:hover {
  color: $primary-color;
}

.descrition {
  text-align: center;

  p,
  h3 {
    text-align: left;
  }

  .summary {
    width: 100%;
    text-align: left;

    p {
      hyphens: auto;
    }
  }

  .track-tags {
    text-align: left;
  }
}

.summary {
  width: 100%;

  p {
    hyphens: auto;
  }
}

.p-badge {
  margin: 0 5px;
}

.primary-button {
  margin: auto;
  margin-top: 2rem;
}
</style>
