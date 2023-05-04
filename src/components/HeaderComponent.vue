<template>
  <div class="header">
    <button class="primary-button" v-if="loggedIn" @click="signOut">
      Sign Out
    </button>
    <button class="primary-button" v-else @click="signIn">Sign In</button>
  </div>
</template>

<script>
import { signOut } from "firebase/auth";
import { auth } from "../firebase/init";

export default {
  data() {
    return {
      loggedIn: false,
    };
  },
  methods: {
    checkIfUserSignedIn() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      });
    },
    signOut() {
      signOut(auth).then(() => {
        this.isLoggedIn = false;
        this.$router.push({ path: "/" });
      });
    },
    signIn() {
      this.$router.push({ path: "/sign-in" });
    },
  },
  mounted() {
    this.checkIfUserSignedIn();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.header {
  position: fixed;
  padding: 1rem;
  width: 100%;
  text-align: right;
  background-color: $secondary-color;
  z-index: 10000;

  p {
    margin: 0;
  }
}
</style>
