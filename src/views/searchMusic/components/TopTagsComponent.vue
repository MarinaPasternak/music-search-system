<template>
  <div class="top-tags-container">
    <h2 class="gradient-title">Moods & genres</h2>
    <div class="flex-container" v-if="topTags">
      <div v-for="(tag, index) in topTags" :key="index" class="tags-list">
        <Button
          :label="tag.name"
          :severity="severity[severityRandomNumber()]"
          raised
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Button from "primevue/button";
export default {
  data() {
    return {
      severity: ["success", "info", "warning", "danger"],
    };
  },
  components: {
    Button,
  },
  computed: {
    ...mapState({
      topTags: (state) => state.topTags.topTags,
    }),
  },
  methods: {
    ...mapActions(["fetchTopTags"]),
    severityRandomNumber() {
      return Math.floor(Math.random() * 4);
    },
  },
  created() {
    this.fetchTopTags();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.top-tags-container {
  margin: 2rem 0;
}

.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  button {
    margin: 0.3rem;
  }
}

::v-deep button.p-button-danger {
  background-color: $purple-color;
}

::v-deep button.p-button-warning {
  background-color: $primary-color;
}

::v-deep button.p-button-success {
  background-color: $pink-color;
}

::v-deep button.p-button-success:enabled:hover,
button.p-button-success:enabled:focus {
  background-color: $primary-color;
}
::v-deep button.p-button-warning:enabled:hover,
button.p-button-warning:enabled:focus {
  background-color: $purple-color;
}
::v-deep button.p-button-danger:enabled:hover,
button.p-button-danger:enabled:focus {
  background-color: $pink-color;
}
</style>
