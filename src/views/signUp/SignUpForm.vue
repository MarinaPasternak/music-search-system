<template>
  <div class="sign-up-container">
    <h2 class="gradient">Sign Up</h2>
    <div class="form-container">
      <div class="full-name-input-group input-group">
        <div class="p-inputgroup">
          <div class="flex-container">
            <span
              class="p-inputgroup-addon"
              :class="{ 'p-invalid': fullNameError }"
            >
              <i class="pi pi-user"></i>
            </span>
            <InputText
              placeholder="Full name"
              v-model="fullName"
              :class="{ 'p-invalid': fullNameError }"
              @blur="touched.fullName = true"
            />
          </div>
          <small class="p-invalid">{{ fullNameError }}</small>
        </div>
      </div>
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
      <div class="password-confirm-input-group input-group">
        <div class="p-inputgroup">
          <div class="flex-container">
            <span
              class="p-inputgroup-addon"
              :class="{ 'p-invalid': confirmPasswordError }"
            >
              <i class="pi pi-key"></i>
            </span>
            <Password
              placeholder="Password Confirm"
              v-model="confirmPassword"
              :class="{ 'p-invalid': confirmPasswordError }"
              @blur="touched.confirmPassword = true"
            />
          </div>
          <small class="p-invalid">{{ confirmPasswordError }}</small>
        </div>
      </div>
      <p>
        Already have an account
        <router-link to="/sign-in"
          ><span class="link-to-form">Sign In</span></router-link
        >
      </p>
      <button class="primary-button" :disabled="isFormInvalid" @click="signUp">
        Continue
      </button>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/init";
import { notify } from "@kyvg/vue3-notification";

import InputText from "primevue/inputtext";
import Password from "primevue/password";

export default {
  name: "SugnUpForm",
  components: {
    InputText,
    Password,
  },
  data() {
    return {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      touched: {
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
    };
  },
  computed: {
    fullNameError() {
      const fullNameRegex = /^[A-Za-z\s]+$/;
      if (!this.touched.fullName) return "";
      if (!this.fullName) return "Full Name is required.";
      if (this.fullName.length < 5)
        return "Full name must be at least 5 characters.";
      if (!fullNameRegex.test(this.fullName))
        return "Full Name can only contain letters and spaces.";

      return "";
    },
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
    confirmPasswordError() {
      if (!this.touched.confirmPassword) return "";
      if (!this.confirmPassword) return "Confirm Password is required.";
      if (this.confirmPassword !== this.password)
        return "Confirm Password must match Password.";

      return "";
    },
    isFormInvalid() {
      const errorMessage =
        this.fullNameError ||
        this.emailError ||
        this.passwordError ||
        this.confirmPasswordError;

      const isFormTouched =
        this.touched.fullName &
        this.touched.email &
        this.touched.password &
        this.touched.confirmPassword;

      if (errorMessage.length > 0) {
        return true;
      } else if (isFormTouched && errorMessage.length === 0) {
        return false;
      }

      return true;
    },
  },
  methods: {
    signUp() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: this.fullName,
          });
          notify({
            title: "Authorization",
            text: "You have been registered!",
          });
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          notify({
            type: "error",
            title: "You have not signed up!",
            text: `${error.message}`,
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.sign-up-container {
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
