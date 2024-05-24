<template>
      
<v-app>
   <div class="d-flex ga-8 mt-20 flex-column" id="Background">
      <v-btn :to="{path: '/home'}" density="comfortable" icon="mdi-arrow-left-bold-outline" size="x-large" style="margin: 10px 10px;"></v-btn>
   </div>
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
                     v-model="formSignup.email"
                     name="email"
                     label="Email"
                     type="email"
                     placeholder="email"
                     required
                  ></v-text-field>

                  <v-text-field
                     v-model="formSignup.username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>
                  
                  <v-text-field
                     v-model="formSignup.password"
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
import { onBeforeMount } from "vue";
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
      onBeforeMount() {
         this.loadFunc();
      },
      loadFunc() {
         if (localStorage.token != 0) {
            this.$router.push({ path: '/home' })
         }
         else {}
      },

      async login() {
         // LOGIN WITH USERNAME
         if (this.formLogin.email=='') {
            const loginData = {
               Username: this.formLogin.username,
               Password: this.formLogin.password
            };

            console.log(loginData);

            await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/login/user", loginData)
            .then((response) => {
               console.log("answer from server:", response.data);
               let token = response.data;
               localStorage.setItem('token', token);
               this.$router.push({ path: '/home' });
            })
            .catch((error) => {
               console.log("error recieved");
               console.error("Error with the GET request:", error);
            });
         }

         // LOGIN WITH EMAIL
         else {
            const loginData = {
               Email: this.formLogin.email,
               Password: this.formLogin.password
            };

            console.log(loginData);

            await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/login/email", loginData)
            .then((response) => {
               console.log("answer from server:", response.data);
               let token = response.data;
               localStorage.setItem('token', token);
               this.$router.push({ path: '/home' });
            })
            .catch((error) => {
               console.log("error recieved");
               console.error("Error with the GET request:", error);
            });
         }
      },
      async signup() {
         const signupData = {
            Email: this.formSignup.email,
            Username: this.formSignup.username,
            Password: this.formSignup.password
         };

         console.log(signupData);

         await axios.post("http://" + import.meta.env.VITE_SERVER_IP + ":" + import.meta.env.VITE_SERVER_PORT + "/signup", signupData)
         .then((response) => {
            console.log("answer from server:", response.data);
            if (response.status === 200) {
            alert("Signup successful! Please check your email to verify your account.");
            this.pageToLogin(); // Switch to the login page
            }
         })
         .catch((error) => {
            console.log("error received");
            console.error("Error with the POST request:", error);
            this.generalError = "Signup failed. Please try again.";
         });
      },
      pageToSignup() {
         this.currentPageIsLogin = false;
         this.currentPageIsSignup = true;
      },
      pageBack(){
         this.$router.push({ name: 'Home'});
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