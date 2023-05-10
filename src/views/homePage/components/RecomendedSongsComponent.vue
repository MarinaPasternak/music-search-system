<template>
  <div class="recomeded-songs-container">
    <h2 class="gradient-title">Recommended Songs</h2>
    <div v-if="loading">
      <loading-component></loading-component>
    </div>
    <div v-else-if="recommendedSongs.length > 0">
      <div class="flex-container">
        <track-card
          v-for="(track, index) in pagedRecomendedTracks"
          :key="track.songTitle + track.artistName"
          :postionInChart="index + offset + 1"
          :trackName="track.songTitle"
          :artistName="track.artistName"
          :trackSearched="track"
        ></track-card>
      </div>
      <Paginator
        class="paginator"
        :first="offset"
        :rows="10"
        :totalRecords="recommendedSongs.length"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        @page="onPageChangeHandler"
      />
    </div>
  </div>
</template>

<script>
import { likedSongsByUserRef } from "../../../firebase/init";
import { onSnapshot } from "firebase/firestore";
import axios from "axios";
import TrackCard from "@/components/TrackCard.vue";
import Paginator from "primevue/paginator";
import LoadingComponent from "@/components/LoadingComponent.vue";
const API_KEY = process.env.VUE_APP_LAST_FM_API_KEY;

export default {
  components: { TrackCard, Paginator, LoadingComponent },
  name: "RecomendedSongsComponent",
  data() {
    return {
      likedSongs: [],
      recommendedSongs: [],
      databaseRef: likedSongsByUserRef,
      offset: 0,
      rowsPerPage: 5,
      loading: false,
    };
  },
  computed: {
    pagedRecomendedTracks() {
      return this.recommendedSongs.slice(
        this.offset,
        this.offset + this.rowsPerPage
      );
    },
  },
  methods: {
    onPageChangeHandler(event) {
      this.offset = event.first;
      this.pageSize = event.rows;
    },
    snapShot() {
      onSnapshot(likedSongsByUserRef, async (snapshot) => {
        if (snapshot.data() && snapshot.data().AllLikedSongs) {
          this.likedSongs = snapshot.data().AllLikedSongs;
        } else {
          this.likedSongs = [];
        }
        this.likedSongs = await Promise.all(
          this.likedSongs.map(async (item) => {
            const [songTitle, artistName] = item.split("~");
            const response = await axios.get(
              `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artistName}&track=${songTitle}&format=json`
            );
            const tags =
              response.data.track.toptags?.tag?.map((tag) => tag.name) || [];
            return { songTitle, artistName, tags };
          })
        );
      });
    },
    async getRecommendedSongs() {
      try {
        this.loading = true;
        // Wait for likedSongs to be loaded before making the API request
        if (!this.likedSongs) {
          this.loading = false;
          return;
        }

        // Get a list of recommended songs based on the user's liked songs
        const recommendedSongs = await this.getSimilarSongs(this.likedSongs);

        // Calculate the similarity score of each recommended song based on its tags
        const tagSimilarities = recommendedSongs.map((song) => {
          if (song && song.tags) {
            const userTags = this.likedSongs.flatMap((s) => s.tags);

            const songTags = song.tags;

            // Calculate the Jaccard similarity coefficient between the user tags and the song tags
            const intersection = new Set(
              userTags.filter((tag) => songTags.includes(tag))
            );
            const union = new Set([...userTags, ...songTags]);
            const similarityScore = intersection.size / union.size;

            return {
              name: song.title,
              artist: { name: song.artist },
              tags: songTags,
              playcount: song.playcount,
              similarityScore,
            };
          }
        });

        // Filter the recommended songs based on their similarity to the user's liked songs
        this.recommendedSongs = tagSimilarities
          .filter((song) => {
            if (song && song.similarityScore > 0) {
              return song;
            }
          })
          .sort((a, b) => b.similarityScore - a.similarityScore);

        console.log(this.recommendedSongs);

        // Log the similarity score of each recommended song
        this.recommendedSongs.forEach((song) => {
          console.log(
            `${song.title} - ${song.artist}: ${song.similarityScore}`
          );
        });
      } catch (error) {
        console.error(error);
      }
    },
    async getSimilarSongs(seedSongs) {
      try {
        // Make a request to the Last.fm API to get a list of similar songs
        const similarSongs = [];

        // Loop through each seed song and make a request to the Last.fm API to get a list of similar songs
        for (const song of seedSongs) {
          const response = await axios.get(
            `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${song.artistName}&track=${song.songTitle}&api_key=${API_KEY}&limit=10000&format=json`
          );

          // Extract the list of similar songs from the response and add them to the overall list
          if (response.data.similartracks) {
            const songs = response.data.similartracks.track.map(
              async (track) => {
                const trackResponse = await axios.get(
                  `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${track.artist.name}&track=${track.name}&format=json`
                );

                let tags = null;

                if (trackResponse.data.track) {
                  tags = trackResponse.data.track.toptags.tag.map(
                    (tag) => tag.name
                  );

                  return {
                    title: track.name,
                    artist: track.artist.name,
                    tags: tags,
                    playcount: track.playcount,
                  };
                }
              }
            );
            similarSongs.push(...(await Promise.all(songs)));
          }
        }

        this.loading = false;

        return similarSongs;
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    likedSongs(newLikedSongs) {
      if (newLikedSongs && newLikedSongs.length > 0) {
        this.getRecommendedSongs();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.snapShot();
    }, 2000);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.recomeded-songs-container {
  margin: 2rem 0;
  margin-bottom: 3rem;

  h2 {
    margin: 3rem 0;
  }

  .loading-component {
    margin-top: 3rem;
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
</style>
