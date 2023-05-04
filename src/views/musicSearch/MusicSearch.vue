<template>
  <div class="music-search-component">
    <div class="searcher-container">
      <InputText v-model="query" placeholder="Search for a song" />
      <Button @click="searchSongs" icon="pi pi-search" size="large"></Button>
    </div>
    <template v-if="loading">
      <loading-component></loading-component>
    </template>
    <template v-if="!loading && !error && !songs">
      <h2 class="gradient-title">You haven't searched for a song yet</h2>
    </template>
    <template v-else-if="!loading && songs && songs.length > 0">
      <div class="container">
        <h2 class="gradient-title">
          Your search results - {{ songs.length }} songs
        </h2>
        <div class="flex-container">
          <track-card
            v-for="(track, index) in pagedFoundTracks"
            :key="track.url"
            :postionInChart="index + offset + 1"
            :trackName="track.name"
            :artistName="track.artist.name"
            :trackSearched="track"
          ></track-card>
        </div>
        <Paginator
          class="paginator"
          :first="offset"
          :rows="10"
          :totalRecords="songs.length"
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          @page="onPageChangeHandler"
        />
      </div>
    </template>
    <template v-else-if="!loading && songs && songs.length === 0">
      <div><h2 class="gradient-title">Nothing has been Found</h2></div>
    </template>
    <template v-else-if="error">
      <div>
        <h2 class="gradient-title">{{ error }}</h2>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import FuzzySet from "fuzzyset.js";

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import LoadingComponent from "@/components/LoadingComponent.vue";
import TrackCard from "@/components/TrackCard.vue";
export default {
  name: "MusicSearchComponent",
  components: {
    InputText,
    Button,
    Paginator,
    LoadingComponent,
    TrackCard,
  },
  data() {
    return {
      query: "",
      songs: null,
      loading: false,
      error: "",
      offset: 0,
      rowsPerPage: 10,
    };
  },
  computed: {
    pagedFoundTracks() {
      return this.songs.slice(this.offset, this.offset + this.rowsPerPage);
    },
  },
  methods: {
    onPageChangeHandler(event) {
      this.offset = event.first;
      this.pageSize = event.rows;
    },
    async searchSongs() {
      this.songs = null;
      this.loading = true;
      this.error = "";
      const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

      try {
        // Search for tracks on Last.fm
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.query}&api_key=${API_KEY}&limit='8000'&format=json`
        );
        const tracks = response.data.results.trackmatches.track;

        // Use FuzzySet.js to perform fuzzy string matching
        const fuzzyTracks = FuzzySet(
          tracks.map((t) => `${t.artist}~${t.name}`)
        );

        const matchedTracks = fuzzyTracks.exactSet;

        // Query Last.fm for additional song information
        let songPromises = [];

        for (let key in matchedTracks) {
          const [artist, name] = key.split("~");

          const response = axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artist}&track=${name}&format=json`
          );

          songPromises.push(response);
        }

        const songResponses = await Promise.all(songPromises);
        const songs = songResponses.map((response) => response.data.track);
        const definedSongs = songs.filter((song) => song !== undefined);

        // this.songs = definedSongs;
        const tagResponse = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${this.query}&api_key=${API_KEY}&limit=1000&format=json`
        );
        const tagTracks = tagResponse.data.tracks.track;

        // Use FuzzySet.js to perform fuzzy string matching
        const fuzzyTagTracks = FuzzySet(
          tagTracks.map((t) => `${t.artist.name}~${t.name}`)
        );

        const matchedTagTracks = fuzzyTagTracks.exactSet;

        // Query Last.fm for additional song information
        let tagSongPromises = [];

        for (let key in matchedTagTracks) {
          const [artist, name] = key.split("~");

          const response = axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artist}&track=${name}&format=json`
          );

          tagSongPromises.push(response);
        }

        const tagSongResponses = await Promise.all(tagSongPromises);
        const tagSongs = tagSongResponses.map(
          (response) => response.data.track
        );
        const definedTagSongs = tagSongs.filter((song) => song !== undefined);

        // Combine and deduplicate the results
        const allSongs = [...definedSongs, ...definedTagSongs];
        const dedupedSongs = Array.from(new Set(allSongs));

        this.songs = dedupedSongs;
      } catch (error) {
        console.error(error);
        this.error = "An error occurred while searching for songs.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.music-search-component {
  h2 {
    margin: 3rem;
    text-align: center;
  }

  .loading-component {
    margin-top: 3rem;
  }
}

.searcher-container {
  margin: auto;
  margin-top: 2rem;
  width: fit-content;
  background-color: $secondary-color;

  input {
    width: 600px;
    border: none;
    background-color: $secondary-color;
  }

  button {
    background-color: $secondary-color;
  }
}

.flex-container {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

.paginator {
  width: fit-content;
  margin: auto;
}

::v-deep input.p-inputtext:enabled:focus {
  border: none;
  box-shadow: none;
}
</style>
