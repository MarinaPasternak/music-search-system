<template>
  <div>
    <h1>My Liked Songs</h1>
    <ul>
      <li v-for="song in likedSongs" :key="song.artistName">
        {{ song.songTitle }} by {{ song.artistName }}
      </li>
    </ul>
    <h1>Search for Similar Songs</h1>
    <form @submit.prevent="searchSongs">
      <label>
        Search Query:
        <input v-model="query" required />
      </label>
      <button type="submit">Search</button>
    </form>
    <ul>
      <li v-for="song in searchedSongs" :key="song.id">
        {{ song.name }} by {{ song.artist }}
        <button @click="likeSong(song)">Like</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { likedSongsByUserRef } from "../../../firebase/init";
import { onSnapshot } from "firebase/firestore";
import { addSongToLikedSongs } from "../../../firebase/init";
import { notify } from "@kyvg/vue3-notification";
import FuzzySet from "fuzzyset.js";
import axios from "axios";

export default {
  name: "LikedSongsComponent",
  data() {
    return {
      likedSongs: [],
      query: "",
      searchedSongs: [],
      loading: false,
      error: "",
      API_KEY: process.env.VUE_APP_LAST_FM_API_KEY,
      databaseRef: likedSongsByUserRef,
    };
  },
  created() {
    setTimeout(() => {
      this.snapShot();
    }, 2000);
  },
  methods: {
    async searchSongs() {
      this.loading = true;
      this.error = "";

      try {
        // Search for tracks on Last.fm
        const response = await axios.get(
          `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.query}&api_key=${this.API_KEY}&limit='1500'&format=json`
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
            `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.API_KEY}&artist=${artist}&track=${name}&format=json`
          );

          songPromises.push(response);
        }

        const songResponses = await Promise.all(songPromises);
        const songs = songResponses.map((response) => response.data.track);
        const definedSongs = songs.filter((song) => song !== undefined);

        // Filter out already liked songs
        // const likedSongIds = this.likedSongs.map((song) => song.id);
        // this.searchedSongs = definedSongs.filter(
        //   (song) => !likedSongIds.includes(song.id)
        // );
        this.searchedSongs = definedSongs;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    likeSong(song) {
      // Add liked song to Firebase
      addSongToLikedSongs(song.name, song.artist.name)
        .then(() => {
          console.log("Document added successfully!");
          notify({
            title: "Liked!",
            text: `You have laked ${song.name} by ${song.artist.name}`,
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
    },
    snapShot() {
      onSnapshot(likedSongsByUserRef, (snapshot) => {
        if (snapshot.data()) {
          this.likedSongs = snapshot.data().AllLikedSongs;
        } else {
          this.likedSongs = [];
        }
        this.likedSongs = this.likedSongs.map((item) => {
          const [songTitle, artistName] = item.split("~");
          return { songTitle, artistName };
        });
      });
    },
  },
};
</script>
