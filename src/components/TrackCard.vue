<template>
  <div class="track-card" v-if="track">
    <div class="d-flex">
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
              ><a :href="track.artist.url">{{
                this.track.artist.name
              }}</a></span
            >
            - {{ this.track.name }}
          </h4>
          <Button
            icon="pi pi-heart-fill"
            class="like"
            text
            rounded
            @click="showRulesForm"
            :class="{ hidden: isItLiked }"
          />
        </div>
        <div class="track-description">
          <p>{{ playcountCut }}</p>
          <badge v-for="tagName in topTags" :key="tagName" :value="tagName" />
        </div>
      </div>
    </div>
    <div
      class="add-rules-container"
      :class="{ hidden: !showDialog || isItLiked }"
    >
      {{ !showDialog || isItLiked }}
      <div class="p-field">
        <label for="structural">Structural</label>
        <Dropdown
          v-model="structural"
          :options="rules.structural"
          :option-label="(option) => option.description"
          :option-value="(option) => option.score"
        />
      </div>
      <div class="p-field">
        <label for="affective">Affective</label>
        <Dropdown
          v-model="affective"
          :options="rules.affective"
          :option-label="(option) => option.description"
          :option-value="(option) => option.score"
        />
      </div>
      <div class="p-field">
        <label for="kinesthetic">Kinesthetic</label>
        <Dropdown
          v-model="kinesthetic"
          :options="rules.kinesthetic"
          :option-label="(option) => option.description"
          :option-value="(option) => option.score"
        />
      </div>
      <div class="p-field">
        <Button label="Save" class="p-mr-2" @click="likeSong()" />
        <Button
          label="Cancel"
          class="p-button-secondary"
          @click="showDialog = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { addSongToLikedSongs, checkSongUniqueness } from "../firebase/init";
import { notify } from "@kyvg/vue3-notification";

import Badge from "primevue/badge";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
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
    Dropdown,
  },
  data() {
    return {
      track: null,
      likeDisabled: false,
      showDialog: false,
      affective: 5,
      structural: 5,
      kinesthetic: 5,
      rules: {
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
      },
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
      if (this.track.toptags && this.track.toptags.tag.length === 0) {
        return ["no tags rigth now"];
      } else if (this.track.tags) {
        return this.track.tags;
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
      const likedSong = {
        title: this.track.name,
        artist: this.track.artist.name,
        affective: {
          score: this.affective,
          description: this.getDescription(
            this.affective,
            this.rules.affective
          ),
        },
        structural: {
          score: this.structural,
          description: this.getDescription(
            this.structural,
            this.rules.structural
          ),
        },
        kinesthetic: {
          score: this.kinesthetic,
          description: this.getDescription(
            this.kinesthetic,
            this.rules.kinesthetic
          ),
        },
      };
      const isSongAlreadyLiked = await checkSongUniqueness(likedSong);

      if (isSongAlreadyLiked) {
        notify({
          title: "Sorry,",
          text: "You have already liked this song",
        });
      } else {
        addSongToLikedSongs(likedSong)
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
    showRulesForm() {
      this.showDialog = true;
    },
    getDescription(score, rules) {
      // Find the rule with the closest score to the given score
      const rule = rules.reduce((prev, curr) =>
        Math.abs(curr.score - score) < Math.abs(prev.score - score)
          ? curr
          : prev
      );

      return rule.description;
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
  flex-direction: column;
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

.add-rules-container {
  display: flex;
  width: fit-content;
  padding: 15px;
  margin: 1rem;
  margin-left: 2.5rem;
  background-color: rgb(26, 26, 26);

  .p-field {
    display: flex;
    flex-direction: column;
    margin-right: 15px;
  }

  .p-field:last-child {
    button {
      margin-bottom: 10px;
    }
  }
}

.hidden {
  display: none;
}

::v-deep span.pi-heart-fill {
  color: $dark-purple-color;
}

::v-deep span.p-inputtext {
  padding: 0.5rem 0.5rem;
}
</style>
