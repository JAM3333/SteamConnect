<template>
  <v-navigation-drawer permanent expand-on-hover rail style="position: fixed;">
    <v-list density="compact" nav>
      <v-list-item :to="{path: '/home'}" prepend-icon="mdi-alpha-q" title= "Qizzard"></v-list-item>
    </v-list>

    <v-divider></v-divider>
<!-- Website for icons: https://pictogrammers.com/library/mdi/ -->
    <v-list density="compact" class="d-flex justify space-between flex-column" nav>
        <v-list-item prepend-icon="mdi-plus-circle-outline" title="Create Quiz" value="CreateQuiz" :to="{path: '/quizcreator'}"></v-list-item>
      <v-list-item prepend-icon="mdi-magnify" title="Discover" value="discover" :to="{path: '/discover'}"></v-list-item>
      <v-list-item prepend-icon="mdi-folder" title="My Quizzes" value="myQuiz" :to="{path: '/home'}"></v-list-item>
    </v-list>
    <template v-slot:append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-account-alert" title="Login/Sign Up" value="Login" v-if="!loggedIn" :to="{path: '/login'}"></v-list-item>
        <v-list-item prepend-avatar="../assets/logo.png" title="{this.Username}" value="Account" v-if="loggedIn">
          <v-icon @click="logout()" style="position: absolute; left: 210px; right: 0; bottom: 8px; " color="error" v-if="loggedIn">mdi-logout</v-icon>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
 export default {
  name: 'Navbar',
  data() {
    return {
      Username: 'fish',
      loggedIn: false,
    };
  },
  methods: {
    logout() {
      this.loggedIn = !this.loggedIn;
    },
},
};
</script>
