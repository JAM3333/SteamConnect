<script setup>
  import QuizCard from "../components/QuizCard.vue";
  import AxiosGet from "../JavaScript/AxiosGet.js";
</script>

<template>
  <v-app>
    <SideBar></SideBar>
    <v-main id="Background" color="background" class="d-flex align-center justify-center ga-8 mt-20 flex-column " height="100vh">
      <div class="d-flex align-center justify-space-between">
        <v-card width="34vw"  id="BgTransparent" height="40vh" class="d-flex align-center flex-column mr-8 justify-space-between" elevation="12">
          <v-toolbar color="primary" class="text-h1" title="Create Quizzes!"></v-toolbar>
          <v-container class="d-flex align-center flex-row justify-space-between">
            <p>With just a few clicks, you can craft captivating quizzes that captivate and challenge your audience. Whether you're a teacher, marketer, or quiz enthusiast, our user-friendly interface empowers you to design custom quizzes tailored to your specific needs. From multiple-choice to true/false, unleash your creativity and watch as your quizzes come to life, sparking curiosity and fostering learning. Join us today and embark on a journey of interactive discovery!</p>
            <v-icon icon="mdi-plus-circle-outline" style="font-size: 100px;" class="flex-grow-1 ml-10"></v-icon>
          </v-container>
          <v-btn prepend-icon="mdi-plus-circle-outline" color="button" :to="{path: '/quizCreator'}">Create Quizzes</v-btn>
        </v-card>
        <v-card width="34vw" id="BgTransparent" height="40vh" class="d-flex align-center flex-column justify-space-between" elevation="12">
          <v-toolbar color="primary" title="Browse Quizzes!"></v-toolbar>
          <v-container class="d-flex align-center flex-row justify-space-between">
            <p>Step into the virtual library of quizzes! Dive into a world where curiosity meets knowledge, where every click opens a new door to discovery. With a plethora of topics at your fingertips, from history to pop culture, science to literature, the possibilities are endless. Browse through shelves lined with quizzes designed to challenge, entertain, and enlighten.</p>
            <v-icon icon="mdi-magnify" style="font-size: 100px;" class="flex-grow-1 ml-10"></v-icon>
          </v-container>
          <v-btn prepend-icon="mdi-magnify" color="button" :to="{path: '/discover'}">Discover</v-btn>

        </v-card>
    </div>
    <div class="d-flex align-center justify-center ga-8">
        <v-card id="BgTransparent" width="70vw"  height="fit-content" elevation="12">
          <v-data-iterator :items="quizData" :items-per-page="4" :search="search" >
            <template v-slot:header>
              <v-toolbar color="primary" title="Your Library" >
                <v-text-field
                  v-model="search"
                  clearable
                  density="comfortable"
                  hide-details
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                  style="max-width: 300px"
                  variant="solo"
                  class="pr-2"
                ></v-text-field>
              </v-toolbar>
            </template>

            <template v-slot:default="{ items }">
              <v-container class="pa-2" fluid>
                <v-row dense>
                  <v-col v-for="item in items" :key="item.title" cols="auto">
                    <QuizCard class="fill-height"
                      :initFunction="Initialize"
                      :name="item.raw.QuizName"
                      :image="item.raw.QuizImage"
                      :id="item.raw.QuizID"
                      :edit=true
                    ></QuizCard>
                  </v-col>
                </v-row>
              </v-container>
            </template>
              
            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
              <div class="d-flex align-center justify-center pa-4">
                <v-btn
                  :disabled="page === 1"
                  icon="mdi-arrow-left"
                  density="comfortable"
                  variant="tonal"
                  rounded
                  @click="prevPage"
                ></v-btn>

                <div class="mx-2 text-caption">
                  Page {{ page }} of {{ pageCount }}
                </div>

                <v-btn
                  :disabled="page >= pageCount"
                  icon="mdi-arrow-right"
                  density="comfortable"
                  variant="tonal"
                  rounded
                  @click="nextPage"
                ></v-btn>
              </div>
            </template>
        </v-data-iterator>
      </v-card>
    </div>
    </v-main>
    
  </v-app>
</template>
<script>
import SideBar from '../components/Navbar.vue'
import axios from "axios";

const apiUrl = "http://10.115.2.40:3004";

export default {
  name: 'App',
  mounted(){
    this.Initialize();
  },
  data: () => ({
    search: '',
    quizData: [], 
  }),
  methods: {
    async Initialize(){
      var userId = await AxiosGet(`select UserID from Users where Token='`+localStorage.getItem('token')+`';`)
      if (userId[0]){
        axios.get(`${apiUrl}/getQuizzes?format=json`,{params: {userid: userId[0].UserID}}).then((response) => {     //{sqlQuery: `select QuizName,QuizImage from Quizzes where UserIDFK=1`}
        //response.data.QuizImage = apiUrl+response.data.QuizImage
        this.quizData = response.data;
      })
      .catch((error) => {
        console.error("Error with the GET request:", error)
      })
      }
    },
  }
};
</script>

<style>
  #Background {
      background: url('../assets/bg_login_modified_dark.jpg') no-repeat center center fixed !important;
   }      
   #BgTransparent{
    background-color: #3e3e3ed5;
   }  
</style>



