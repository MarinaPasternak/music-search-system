<template>
  <div class="track-card">
    <p>{{ postionInChart + 1 }}.</p>
    <img :src="track.image[0]['#text']" :alt="track.name" />
    <div class="track-information">
      <h4>
        <span
          ><a :href="track.artist.url">{{ track.artist.name }}</a></span
        >
        - {{ track.name }}
      </h4>
      <div class="track-description">{{ playcountCut }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrackCard",
  props: ["postionInChart", "track"],
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.track-card {
  display: flex;
  margin-bottom: 1rem;

  p {
    width: 20px;
  }

  img {
    margin: 0 1.5rem;
  }

  h4 a:hover {
    color: $primary-color;
  }
}
</style>
