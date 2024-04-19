<template>
<v-app>
    <v-main id="Background" class="d-flex align-center justify-center ga-8 mt-20 flex-column">
            <v-card width="34vw" color="secondary" height="400px" class="d-flex align-center flex-column mr-16" elevation="12">
                <v-btn-toggle v-model="toggle_one" mandatory width="34vw">
                    <v-btn @click="pageToLogin()" width="17vw">Login</v-btn>
                    <v-btn @click="pageToSignup()" width="17vw">Sign Up</v-btn>
                </v-btn-toggle> 

                <!-- LOGIN -->
                <form v-if="currentPageIsLogin" ref="form" @submit.prevent="login($event)" style="margin-top: 60px;">

                  <v-text-field
                  v-if="currentLoginMethodUsername"
                     v-model="username"
                     name="username"
                     label="Username"
                     type="text"
                     placeholder="username"
                     required
                  ></v-text-field>
                  <v-text-field
                  v-if="!currentLoginMethodUsername"
                     v-model="email"
                     name="email"
                     label="Email"
                     type="email"
                     placeholder="username"
                     required
                  ></v-text-field>
                  <p @click="toggleEmailLogin()" v-if="currentLoginMethodUsername">login with email instead</p>
                  <p @click="toggleEmailLogin()" v-if="!currentLoginMethodUsername">login with username instead</p>

                  <v-text-field
                     v-model="password"
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
</style>
 <script>
 import { mapMutations } from "vuex";
 import store from "../store/";
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
       
     };
   },
   methods: {
      ...mapMutations(["setUser", "setToken"]), // Assuming these are defined in your store

async login(e) {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:3002/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const { user, token } = await response.json();

    // Commit mutation using Vuex store (assuming `store` is the imported store instance)
    await store.commit('setUser', user);

    // Optionally commit setToken mutation if needed
    await store.commit('setToken', token);

    this.$router.push("/home");
  } catch (error) {
    console.error("Login error:", error);
    // Handle login error (e.g., display an error message)
  }
},

   //  login() {
   //    const { username } = this;
   //    console.log(username + " logged in");
   //    this.$router.push({ path: '/home' });
   //  },
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