<template>
  <div class="sign-in-container">
    <h2 class="gradient">Sign In</h2>
    <div class="form-container">
      <div class="email-input-group input-group">
        <div class="p-inputgroup">
          <div class="flex-container">
            <span
              class="p-inputgroup-addon"
              :class="{ 'p-invalid': emailError }"
            >
              <i class="pi pi-at"></i>
            </span>
            <InputText
              placeholder="Email"
              v-model="email"
              :class="{ 'p-invalid': emailError }"
              @blur="touched.email = true"
            />
          </div>
          <small class="p-invalid">{{ emailError }}</small>
        </div>
      </div>
      <div class="password-input-group input-group">
        <div class="p-inputgroup">
          <div class="flex-container">
            <span
              class="p-inputgroup-addon"
              :class="{ 'p-invalid': passwordError }"
            >
              <i class="pi pi-key"></i>
            </span>
            <Password
              placeholder="Password"
              v-model="password"
              :class="{ 'p-invalid': passwordError }"
              @blur="touched.password = true"
            />
          </div>
          <small class="p-invalid">{{ passwordError }}</small>
        </div>
      </div>
      <p>
        Do not have an account?
        <router-link to="/sign-up"
          ><span class="link-to-form">Create one!</span></router-link
        >
      </p>
      <button class="primary-button" :disabled="isFormInvalid" @click="logIn">
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/init";
import { notify } from "@kyvg/vue3-notification";

import InputText from "primevue/inputtext";
import Password from "primevue/password";

export default {
  name: "SignInForm",
  components: {
    InputText,
    Password,
  },
  data() {
    return {
      email: "",
      password: "",
      touched: {
        email: false,
        password: false,
      },
    };
  },
  computed: {
    emailError() {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!this.touched.email) return "";
      if (!this.email) return "Email is required.";
      if (!emailRegex.test(this.email)) return "Email is invalid.";

      return "";
    },
    passwordError() {
      if (!this.touched.password) return "";
      if (!this.password) return "Password is required.";
      if (this.password.length < 6)
        return "Password must be at least 6 characters.";

      return "";
    },
    isFormInvalid() {
      const errorMessage = this.emailError || this.passwordError;
      const isFormTouched = this.touched.email & this.touched.password;

      if (errorMessage.length > 0) {
        return true;
      } else if (isFormTouched && errorMessage.length === 0) {
        return false;
      }

      return true;
    },
  },
  methods: {
    logIn() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          notify({
            title: "Sign In",
            text: "You have been logged in!",
          });
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          notify({
            type: "error",
            title: "You have not signed in!",
            text: `${error.message}`,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.sign-in-container {
  width: 40%;
  height: fit-content;
  margin: auto;
  border-radius: 10px;
  background-color: rgb(26, 26, 26);

  .input-group {
    width: 98%;
    margin: 1rem;
  }
}

.form-container {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .primary-button {
    width: 60%;
  }
}

.p-inputgroup {
  display: flex;
  flex-direction: column;
}

.flex-container {
  display: flex;
}
</style>
