<template>
    <v-app>
      <v-main class="d-flex align-center justify-center">
        <v-card width="400px" class="pa-4" elevation="2">
          <v-alert v-if="verificationMessage" type="success">{{ verificationMessage }}</v-alert>
          <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
          <v-btn v-if="successTrue" :to="{path: '/home'}">to Hompage</v-btn>
        </v-card>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    name: "VerifyEmail",
    data() {
      return {
        verificationMessage: "",
        errorMessage: "",
        successTrue: false,
      };
    },
    async created() {
      const Token = {Token: this.$route.query.token}
      if (Token) {
        try {
          await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/verifyemail", Token)
            .then((response) => {
               console.log("answer from server:", response.data);
               const Token = {Token: this.$route.query.token};
               console.log(Token);
               localStorage.setItem('token', Token.Token);
               this.successTrue = true;
               this.verificationMessage = "Your email has been successfully verified!";
            })
            .catch((error) => {
              console.error("Error verifying email:", error);
            this.errorMessage = "Email verification failed. Please try again.";
            });

        } catch (error) {
          console.error("Error verifying email:", error);
          this.errorMessage = "invalid Token! please contact support at support.quizzard@gmail.com."
        }}
    }
  };
  </script>
  
  