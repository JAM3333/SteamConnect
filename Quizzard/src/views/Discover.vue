<script setup>
  import QuizCard from "../components/QuizCard.vue";
  import AxiosGet from "../JavaScript/AxiosGet.js";
</script>

<template>
  <v-app id="Background">
    <SideBar></SideBar>
    <v-main color="background" class="d-flex align-center justify-top ga-8 mt-20 flex-column" height="100vh">
        <v-card width="70vw" class="mt-6" id="BgTransparent" height="95vh" elevation="12">
          <v-data-iterator :items="quizData" :items-per-page="12" :search="search" >
            <template v-slot:header>
              <v-toolbar color="primary" title="Discover" >
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
    </v-main>
    
  </v-app>
</template>
<script>
import SideBar from '../components/Navbar.vue'

export default {
  name: 'App',
  mounted(){
    this.Initialize();
  },
  data: () => ({
    search: '',
    quizData: [{
      QuizName: "Default",
      QuizID: 1,
      QuizImage:"https://th.bing.com/th/id/OIP.GPFEY6kfgxbsja6gmrW6rwHaE7?rs=1&pid=ImgDetMain"
    }], 
    userid: 1,
  }),
  methods: {
    async Initialize(){
      this.quizData = await AxiosGet(`select QuizName,QuizID,QuizImage from Quizzes where Public=1;`)
    }
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



