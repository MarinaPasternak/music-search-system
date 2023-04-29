<template>
  <div class="sign-in-container">
    <h2 class="gradient">Sign In</h2>
    <div class="form-container">
      <div class="email-input-group input-group">
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-at"></i>
          </span>
          <InputText placeholder="Email" />
        </div>
      </div>
      <div class="password-input-group input-group">
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-key"></i>
          </span>
          <InputText placeholder="Password" />
        </div>
      </div>
      <p>
        Do not have an account?
        <router-link to="/sign-up"
          ><span class="link-to-form">Create one!</span></router-link
        >
      </p>
      <button class="primary-button">Continue</button>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";

export default {
  name: "SignInForm",
  components: {
    InputText,
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
</style>
