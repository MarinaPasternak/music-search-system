<template>
  <div class="track-card">
    <p>{{ postionInChart + 1 }}</p>
    <h4>{{ track.name }}</h4>
  </div>
</template>

<script>
export default {
  name: "TrackCard",
  props: ["postionInChart", "track"],
};
</script>

<style lang="scss" scoped></style>
