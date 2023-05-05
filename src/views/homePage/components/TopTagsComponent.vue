<template>
  <div class="top-tags-container">
    <h2 class="gradient-title">Moods & genres</h2>
    <template v-if="isTopTags">
      <loading-component></loading-component>
    </template>
    <template v-else-if="topTags">
      <div class="flex-container">
        <div class="tags-list">
          <Button
            v-for="(tag, index) in topTags"
            :key="index"
            @click="sendData(tag.name)"
            :label="tag.name"
            :severity="severity[severityRandomNumber()]"
            raised
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Button from "primevue/button";
import LoadingComponent from "@/components/LoadingComponent.vue";
export default {
  data() {
    return {
      severity: ["success", "info", "warning", "danger"],
    };
  },
  components: {
    Button,
    LoadingComponent,
  },
  computed: {
    ...mapState({
      topTags: (state) => state.topTags.topTags,
      isTopTags: (state) => state.topTags.loading,
    }),
  },
  methods: {
    ...mapActions(["fetchTopTags"]),
    severityRandomNumber() {
      return Math.floor(Math.random() * 4);
    },
    sendData(tagName) {
      this.$emit("getTagName", tagName);
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
  background-color: $secondary-color;
  border-left: 5px solid $dark-purple-color;
}

::v-deep button.p-button-warning {
  background-color: $secondary-color;
  border-left: 5px solid $primary-color;
}

::v-deep button.p-button-success {
  background-color: $secondary-color;
  border-left: 5px solid $maroon-color;
}

::v-deep button.p-button-info {
  background-color: $secondary-color;
  border-left: 5px solid $blue-color;
}

::v-deep button.p-button-success:enabled:hover,
button.p-button-success:enabled:focus {
  background-color: $maroon-color;
}
::v-deep button.p-button-warning:enabled:hover,
button.p-button-warning:enabled:focus {
  background-color: $primary-color;
}
::v-deep button.p-button-danger:enabled:hover,
button.p-button-danger:enabled:focus {
  background-color: $dark-purple-color;
}

::v-deep button.p-button-info:enabled:hover,
button.p-button-info:enabled:focus {
  background-color: $blue-color;
}
</style>
