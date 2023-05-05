<template>
  <div class="liked-songs-container">
    <h2 class="gradient-title">My Liked Songs</h2>
    <div v-if="likedSongs">
      <div class="flex-container">
        <track-card
          v-for="(track, index) in pagedLikedSongs"
          :key="track.url"
          :postionInChart="index + offset + 1"
          :trackName="track.songTitle"
          :artistName="track.artistName"
          :trackSearched="null"
        ></track-card>
      </div>
      <Paginator
        class="paginator"
        :first="offset"
        :rows="5"
        :totalRecords="likedSongs.length"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        @page="onPageChangeHandler"
      />
    </div>
    <div v-else>
      <h3 class="gradient-title">You don`t have any liked songs</h3>
    </div>
  </div>
</template>

<script>
import { likedSongsByUserRef } from "../../../firebase/init";
import { onSnapshot } from "firebase/firestore";
// import FuzzySet from "fuzzyset.js";
// import axios from "axios";
import TrackCard from "@/components/TrackCard.vue";
import Paginator from "primevue/paginator";

export default {
  components: { Paginator, TrackCard },
  name: "LikedSongsComponent",
  data() {
    return {
      likedSongs: null,
      query: "",
      searchedSongs: [],
      loading: false,
      error: "",
      databaseRef: likedSongsByUserRef,
      offset: 0,
      rowsPerPage: 5,
    };
  },
  computed: {
    pagedLikedSongs() {
      return this.likedSongs.slice(this.offset, this.offset + this.rowsPerPage);
    },
  },
  created() {
    setTimeout(() => {
      this.snapShot();
    }, 2000);
  },
  methods: {
    // async searchSongs() {
    //   this.loading = true;
    //   this.error = "";

    //   try {
    //     // Search for tracks on Last.fm
    //     const response = await axios.get(
    //       `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.query}&api_key=${this.API_KEY}&limit='1500'&format=json`
    //     );
    //     const tracks = response.data.results.trackmatches.track;

    //     // Use FuzzySet.js to perform fuzzy string matching
    //     const fuzzyTracks = FuzzySet(
    //       tracks.map((t) => `${t.artist}~${t.name}`)
    //     );

    //     const matchedTracks = fuzzyTracks.exactSet;

    //     // Query Last.fm for additional song information
    //     let songPromises = [];

    //     for (let key in matchedTracks) {
    //       const [artist, name] = key.split("~");
    //       const response = axios.get(
    //         `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.API_KEY}&artist=${artist}&track=${name}&format=json`
    //       );

    //       songPromises.push(response);
    //     }

    //     const songResponses = await Promise.all(songPromises);
    //     const songs = songResponses.map((response) => response.data.track);
    //     const definedSongs = songs.filter((song) => song !== undefined);
    //     this.searchedSongs = definedSongs;
    //   } catch (error) {
    //     this.error = error.message;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
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
    onPageChangeHandler(event) {
      this.offset = event.first;
      this.pageSize = event.rows;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.liked-songs-container {
  margin: 2rem 0;
  margin-bottom: 3rem;

  h2 {
    margin-bottom: 3rem;
  }
}

.flex-container {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

h3 {
  text-align: center;
}

.paginator {
  width: fit-content;
  margin: auto;
}
</style>
