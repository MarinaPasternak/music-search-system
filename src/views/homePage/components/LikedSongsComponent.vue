<template>
  <div class="liked-songs-container">
    <h2 class="gradient-title">My Liked Songs</h2>
    <div v-if="likedSongs">
      <div class="flex-container">
        <track-card
          v-for="(track, index) in pagedLikedSongs"
          :key="track.title + track.artist"
          :postionInChart="index + offset + 1"
          :trackName="track.title"
          :artistName="track.artist"
          :trackSearched="null"
          :isItLiked="true"
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
  methods: {
    snapShot() {
      onSnapshot(likedSongsByUserRef, (snapshot) => {
        if (snapshot.data() && snapshot.data().AllLikedSongs) {
          this.likedSongs = snapshot.data().AllLikedSongs;
        } else {
          this.likedSongs = [];
        }
      });
    },
    onPageChangeHandler(event) {
      this.offset = event.first;
      this.pageSize = event.rows;
    },
  },
  created() {
    setTimeout(() => {
      this.snapShot();
    }, 1000);
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
