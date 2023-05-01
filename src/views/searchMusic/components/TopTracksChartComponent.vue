<template>
  <div v-if="topTracks">
    {{ topTracks }}
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState({
      topTracks: (state) => state.topTracks.topTracks,
    }),
  },
  methods: {
    ...mapActions(["fetchTopTracks"]),
  },
  mounted() {
    this.fetchTopTracks();
  },
};
</script>

<style lang="scss" scoped></style>
