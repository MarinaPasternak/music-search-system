<template>
  <div class="music-search-container">
    <h1>{{ fullName }}</h1>
    <button class="primary-button">See Statistic</button>
  </div>
</template>

<script>
import { auth } from "../../firebase/init";

export default {
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
  margin-top: 130px;
}
</style>
