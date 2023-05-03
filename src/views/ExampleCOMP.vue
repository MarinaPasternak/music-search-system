<template>
  <div>
    <input v-model="query" placeholder="Search for a song" />
    <button @click="searchSongs">Search</button>
    <ul>
      <li v-for="song in songs" :key="song.url">
        {{ song.name }} by {{ song.artist.name }}
      </li>
    </ul>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";
import FuzzySet from "fuzzyset.js";

export default {
  data() {
    return {
      query: "",
      songs: [],
      loading: false,
      error: "",
    };
  },
  methods: {
    async searchSongs() {
      this.loading = true;
      this.error = "";
      const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

      try {
        // Search for tracks on Last.fm
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.query}&api_key=${API_KEY}&limit='2000'&format=json`
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
          console.log(key);
          const response = axios.get(
            `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artist}&track=${name}&format=json`
          );

          songPromises.push(response);
        }

        const songResponses = await Promise.all(songPromises);
        const songs = songResponses.map((response) => response.data.track);
        const definedSongs = songs.filter((song) => song !== undefined);

        // this.songs = definedSongs;
        console.log("------------------------------------------------------");
        const tagResponse = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${this.query}&api_key=${API_KEY}&limit=2000&format=json`
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
          console.log(key);
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
        console.log(definedTagSongs);

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
