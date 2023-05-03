<template>
  <div class="music-search-container">
    <h1 class="gradient-title">{{ fullName }}</h1>
    <div class="searcher-container">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="value1" placeholder="Search" />
      </span>
    </div>
    <button class="primary-button" @click="redirectToStatisticPage">
      See Statistic
    </button>
    <top-artist-component></top-artist-component>
    <top-tags-component></top-tags-component>
    <top-tracks-chart-component></top-tracks-chart-component>
  </div>
</template>

<script>
import { auth } from "../../firebase/init";

import TopTracksChartComponent from "./components/TopTracksChartComponent.vue";
import TopArtistComponent from "./components/TopArtistComponent.vue";
import TopTagsComponent from "./components/TopTagsComponent.vue";
import InputText from "primevue/inputtext";
import { notify } from "@kyvg/vue3-notification";

export default {
  name: "SearchMusicComponent",
  components: {
    TopTracksChartComponent,
    TopArtistComponent,
    TopTagsComponent,
    InputText,
  },
  data() {
    return {
      fullName: null,
    };
  },
  methods: {
    checkIfUserSignedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.fullName = `Welcome, ${user.displayName}`;
        } else {
          this.fullName = "Welcome, Dear Guest";
        }
      });
    },
    redirectToStatisticPage() {
      if (!auth.currentUser) {
        notify({
          type: "error",
          title: "You are not authorised",
          text: "You are redirected to Home page",
        });
      }

      this.$router.push({ path: "/statistic" });
    },
  },
  created() {
    setTimeout(() => {
      this.checkIfUserSignedIn();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.music-search-container {
  width: 100%;
  margin: 2rem;
  margin-top: 130px;

  h1 {
    text-align: center;
  }
}

.searcher-container {
  margin-top: 2rem;
  text-align: center;

  input {
    width: 600px;
  }
}
</style>
