<template>
<v-app>
    <v-main id="Background" class="d-flex align-center justify-center ga-8 mt-20 flex-column">
      <v-alert id="error" v-if="generalError" type="error">{{ generalError }}</v-alert>
            <v-card width="34vw" color="secondary" height="400px" class="d-flex align-center flex-column mr-16" elevation="12">
                <v-btn-toggle v-model="toggle_one" mandatory width="34vw">
                    <v-btn @click="pageToLogin()" width="17vw">Login</v-btn>
                    <v-btn @click="pageToSignup()" width="17vw">Sign Up</v-btn>
                </v-btn-toggle> 

                <!-- LOGIN -->
                <form v-if="currentPageIsLogin" ref="form" @submit.prevent="login()" style="margin-top: 60px;">

                  <v-text-field
                  v-if="currentLoginMethodUsername"
                     v-model="formLogin.username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>
                  <v-text-field
                  v-if="!currentLoginMethodUsername"
                     v-model="formLogin.email"
                     name="email"
                     label="Email"
                     type="email"
                     placeholder="username"
                     required
                  ></v-text-field>
                  <p @click="toggleEmailLogin()" v-if="currentLoginMethodUsername">login with email instead</p>
                  <p @click="toggleEmailLogin()" v-if="!currentLoginMethodUsername">login with username instead</p>

                  <v-text-field
                     v-model="formLogin.password"
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="password"
                     required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4" color="primary" value="log in" width="20vw">Login</v-btn>
               </form>

               <!-- SIGNUP -->
               <form v-if="currentPageIsSignup" ref="form" @submit.prevent="signup()" style="margin-top: 35px;">
                  <v-text-field 
                     v-model="email"
                     name="email"
                     label="eMail"
                     type="email"
                     placeholder="email"
                     required
                  ></v-text-field>

                  <v-text-field
                     v-model="username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>
                  
                  <v-text-field
                     v-model="password"
                     name="password"
                     label="Password"
                     type="password"
                     placeholder="password"
                     required
                  ></v-text-field>
                  <v-btn type="submit" class="mt-4" color="primary" value="log in" width="20vw" >Sign Up</v-btn>
               </form>
            </v-card>
    </v-main>
</v-app>


</template>
 
<style scoped>
   p:hover {
      color: #07B5FF;
      cursor: pointer;
   }
   p {
      margin-top: 0px;
   } 

   #Background {
      background: url('../assets/bg_login_modified.jpg') no-repeat center center fixed !important;
   }
   #error {
      position: absolute;
      top: 1vh;
   }        
</style>
 <script>
 import axios from "axios";
import { generateCodeFrame } from "vue/compiler-sfc";
 export default {
   name: "Login",
   data() {
     return {
       username: "",
       password: "",
       email: "",
       currentPageIsLogin: true,
       currentPageIsSignup: false,
       currentLoginMethodUsername: true,
       toggle_one: 0,
       generalError: '',
       formLogin: {
         username: "",
         password: "",
         email: "",
       },
       formSignup: {

       }
       
     };
   },
   methods: {
      async login() {
      const loginData = {
         Username: this.formLogin.username,
         Password: this.formLogin.password
      };

      console.log(loginData);

      this.errorMessages = { username: '', password: '' }; // Reset errors
      this.generalError = '';

      try {
        const response = await axios.post('/api/login', this.loginData);
         await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/login", loginData)
         .then((response) => {
            console.log("answer from server:", response.data);
            let token = response.data;
            localStorage.setItem('token', token);
         })
         .catch((error) => {
            console.log("error recieved");
            console.error("Error with the GET request:", error);
         });
         const token = response.data.token;

         // Redirect or perform other actions upon successful login
      } catch (error) {
         if (error.response) {
            // Handle errors based on the response status code
            if (error.response.status === 401) {
            // Specific message for unauthorized access
            this.generalError = 'Incorrect username or password.';
            } else if (error.response.status === 400) {
            // Handling validation errors
            const errors = error.response.data.errors;
            this.errorMessages.username = errors.username || '';
            this.errorMessages.password = errors.password || '';
            } else {
            // General API errors
            this.generalError = 'An error occurred. Please try again later.';
            }
         } else if (error.request) {
            // The request was made but no response was received
            this.generalError = 'No response from server. Check your network connection.';
         } else {
            // Something happened in setting up the request that triggered an error
            this.generalError = 'Error setting up request.';
         }
      }
      },
      signup() {
         const { username } = this;
         console.log(username + " signed up");
         this.$router.push({ path: '/home' });
      },
      pageToSignup() {
         this.currentPageIsLogin = false;
         this.currentPageIsSignup = true;
      },
      pageToLogin() {
         this.currentPageIsLogin = true;
         this.currentPageIsSignup = false;
      },
      toggleEmailLogin() {
         this.currentLoginMethodUsername = !this.currentLoginMethodUsername;
      }
   },
 };
 </script>