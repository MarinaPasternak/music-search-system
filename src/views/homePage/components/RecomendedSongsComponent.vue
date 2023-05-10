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
        console.log(recommendedSongs);

        // Calculate the similarity score of each recommended song based on its tags
        const tagSimilarities = recommendedSongs.map((song) => {
          if (song) {
            const userLikes = this.likedSongs;
            const songRules = {
              affective: song.affective,
              structural: song.structural,
              kinesthetic: song.kinesthetic,
            };

            // calculate similarity based on rules
            const similarityScore = Object.keys(songRules).map((category) => {
              const userCategoryScore = Math.max(
                ...userLikes.map((like) => like[category].score)
              );

              console.log(userCategoryScore);

              let songCategoryScore = 0;

              let sum = 0;
              let count = 0;
              for (let key in songRules) {
                const rule = songRules[key];
                const fuzzyScore = this.fuzzyLogic(
                  rule.score,
                  userCategoryScore
                );
                sum += fuzzyScore;
                count++;
              }
              songCategoryScore = sum / count;
              console.log("songCategoryScore", songCategoryScore);

              return songCategoryScore;
            });

            return {
              name: song.title,
              artist: { name: song.artist },
              rules: songRules,
              playcount: song.playcount,
              similarityScore,
              tags: song.tags,
            };
          }
        });

        // Filter the recommended songs based on their similarity to the user's liked songs
        this.recommendedSongs = tagSimilarities.filter((song) => {
          if (
            song &&
            !song.similarityScore.every((score) => isNaN(score) || score === 0)
          ) {
            return song;
          }
        });

        console.log("this.recommendedSongs", this.recommendedSongs);

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
            `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${song.artist}&track=${song.title}&api_key=${API_KEY}&limit=100&format=json`
          );

          // Extract the list of similar songs from the response and add them to the overall list
          if (response.data.similartracks) {
            const songs = response.data.similartracks.track.map(
              async (track) => {
                const trackResponse = await axios.get(
                  `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${song.artist}&track=${song.title}&format=json`
                );

                let tags = null;

                if (trackResponse.data.track) {
                  tags = trackResponse.data.track.toptags.tag.map(
                    (tag) => tag.name
                  );

                  return {
                    title: track.name,
                    artist: track.artist.name,
                    playcount: track.playcount,
                    affective: {
                      score: Math.floor(Math.random() * 10) + 1,
                      description: this.getDescription(
                        Math.floor(Math.random() * 10) + 1,
                        this.rules.affective
                      ),
                    },
                    structural: {
                      score: Math.floor(Math.random() * 10) + 1,
                      description: this.getDescription(
                        Math.floor(Math.random() * 10) + 1,
                        this.rules.structural
                      ),
                    },
                    kinesthetic: {
                      score: Math.floor(Math.random() * 10) + 1,
                      description: this.getDescription(
                        Math.floor(Math.random() * 10) + 1,
                        this.rules.kinesthetic
                      ),
                    },
                    tags: tags,
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
    fuzzyLogic(ruleScore, userCategoryScore) {
      console.log("ruleScore", ruleScore);
      // Find the rule with the closest score to the given score
      const membershipFunctions = {
        low: (x) =>
          Math.max(0, Math.min((x - 0) / (5 - 0), (10 - x) / (10 - 5))),
        medium: (x) =>
          Math.max(0, Math.min((x - 5) / (10 - 5), (10 - x) / (10 - 5))),
        high: (x) =>
          Math.max(0, Math.min((x - 5) / (10 - 5), (10 - x) / (5 - 0))),
      };

      const membershipLevels = {
        high: membershipFunctions.high(userCategoryScore),
        medium: membershipFunctions.medium(userCategoryScore),
        low: membershipFunctions.low(userCategoryScore),
      };

      console.log("membershipLevels", membershipLevels);

      // Determine the degree of membership of the rule score in each category
      const degreesOfMembership = {
        low: membershipFunctions.low(ruleScore),
        medium: membershipFunctions.medium(ruleScore),
        high: membershipFunctions.high(ruleScore),
      };

      // Determine the degree of support for each category
      const degreesOfSupport = {
        low: Math.min(membershipLevels.low, degreesOfMembership.low),
        medium: Math.min(membershipLevels.medium, degreesOfMembership.medium),
        high: Math.min(membershipLevels.high, degreesOfMembership.high),
      };

      console.log("degreesOfSupport", degreesOfSupport);

      // Determine the total degree of support for all categories
      const totalDegreeOfSupport =
        degreesOfSupport.low + degreesOfSupport.medium + degreesOfSupport.high;

      console.log("totalDegreeOfSupport", totalDegreeOfSupport);

      // Determine the centroid of the support
      const centroid =
        (degreesOfSupport.low * 2 +
          degreesOfSupport.medium * 5 +
          degreesOfSupport.high * 8) /
        totalDegreeOfSupport;

      console.log("centroid", centroid);

      return centroid;
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
