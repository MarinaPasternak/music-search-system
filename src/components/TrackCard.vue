<template>
  <div class="track-card" v-if="track">
    <p>{{ postionInChart }}.</p>
    <template v-if="track.album && track.album.image[0]['#text']">
      <img
        :src="track.album.image[0]['#text']"
        :alt="track.name"
        @click="rediractOnTrackInformation"
      />
    </template>
    <template v-else>
      <div class="color-square" @click="rediractOnTrackInformation"></div>
    </template>
    <div class="track-information">
      <div class="track-header">
        <h4>
          <span
            ><a :href="track.artist.url">{{ this.track.artist.name }}</a></span
          >
          - {{ this.track.name }}
        </h4>
        <Button
          icon="pi pi-heart-fill"
          class="like"
          text
          rounded
          :class="{ hidden: isItLiked }"
          @click="likeSong()"
        />
      </div>
      <div class="track-description">
        <p>{{ playcountCut }}</p>
        <badge v-for="tagName in topTags" :key="tagName" :value="tagName" />
      </div>
    </div>
  </div>
</template>

<script>
import { addSongToLikedSongs, checkUniqueness } from "../firebase/init";
import { notify } from "@kyvg/vue3-notification";

import Badge from "primevue/badge";
import Button from "primevue/button";
import axios from "axios";
const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

export default {
  name: "TrackCard",
  props: [
    "trackName",
    "artistName",
    "postionInChart",
    "trackSearched",
    "isItLiked",
  ],
  components: {
    Badge,
    Button,
  },
  data() {
    return {
      track: null,
      likeDisabled: false,
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
    async likeSong() {
      const isSongAlreadyLiked = await checkUniqueness(
        `${this.track.name}~${this.track.artist.name}`,
        "AllLikedSongs"
      );

      if (isSongAlreadyLiked) {
        notify({
          title: "Sorry,",
          text: "You have already liked this song",
        });
      } else {
        addSongToLikedSongs(this.track.name, this.track.artist.name)
          .then(() => {
            this.likeDisabled = true;

            notify({
              type: "success",
              title: "Liked!",
              text: `You have laked ${this.track.name} by ${this.track.artist.name}`,
            });
          })
          .catch((error) => {
            notify({
              type: "error",
              title: "Error",
              text: error,
            });
            console.error("Error adding document: ", error);
          });
      }
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

.track-header {
  display: flex;
  align-items: flex-end;
}

.hidden {
  display: none;
}

::v-deep span.pi-heart-fill {
  color: $dark-purple-color;
}
</style>
