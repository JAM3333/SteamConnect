<script setup>
import SideBar from "../components/Navbar.vue";
import PlayerCard from "../components/PlayerCard.vue";
import OpenAI from "openai";
import axios from 'axios';
import QuestionClass from "../classes/QuestionClass.js";
import AxiosGet from "../JavaScript/AxiosGet.js";
</script>

<template>
  <v-app id="Background">
    <SideBar></SideBar>
    <v-main class="d-flex align-center justify-center">
      <v-card width="80vw"  height="fit-content" class="d-flex align-center flex-column" id="quizEdit" elevation="12">
        <v-toolbar color="primary" style="text-align: center">  
          <v-toolbar-title>
            {{ returnedData.QuizName }}
          </v-toolbar-title>
        </v-toolbar> 
        <v-container width="75vw" class="d-flex align-center flex-column">
          <v-card width="75vw"  height="55vh" elevation="0" id="BgTransparent"  class="mt-5 pl-4 pr-4 overflow-y-auto">
            <v-expansion-panels >
              <PlayerCard class="fill-height mt-3" v-for="(item, index) in returnedData.Questions" :key="item.title" cols="auto"
                :returnAnswerData="ReturnAnswerData"
                :question="item.Question"
                :index="index"
                :type="item.Type"
                :answers="item.Answers"
                :playerAnswer="item.playerAnswer"
              ></PlayerCard>
            </v-expansion-panels>
          </v-card> 
          <v-container class="d-flex flex-column align-center justify-center flex-shrink-1"  >
            <v-container width="fit-content" class="d-flex flex-row align-center justify-center">
              <v-btn value="submit" :disabled="loading" :loading="loading" v-on:click="SubmitAnswers" class="mt-4  text-h3" height="auto" color="button">
                Submit Answers
              </v-btn>
            </v-container>
            <p class="mb-3">{{ loadingMessage }}</p>
          </v-container>
        </v-container>         
      </v-card>
    </v-main>
    <input id="update" v-model="update" type="bool">
  </v-app>
</template>

<script>
  import Question from "../classes/QuestionClass.js";
export default {

  mounted(){
    this.Initialize();
   
  },
  data: () => ({
    loadingMessage:"",
    loading: false,
    update: false,
    quizID: -1,
    panel: [0],
    returnedData: 
      {"QuizName": "Your Quiz Name",
      "QuizDifficulty": 0, // easy=0; medium=1; difficult=2
      "QuizImage": "image.png",
      "Questions": []
    },
  }),
  methods: { 
    async Initialize(){
      if(this.$route.params.quizID){
        this.quizID = this.$route.params.quizID;
        this.returnedData.AnswerRating = 0;

        this.returnedData.Questions[0] = new Question("Example Question",0,0,["Your answer here"])
        this.returnedData.Questions[0].playerAnswer = "";
        this.returnedData.Questions[1] = new Question("Example Question",1,2,["Your answer here","More","Idk","Something"])
        this.returnedData.Questions[1].playerAnswer = "";
        console.log(this.returnedData)

        var sqlData = await AxiosGet(`select * from Quizzes where QuizID=${this.quizID} and UserIDFK=1`);

        if (sqlData[0].UserIDFK == 1){
          sqlData = sqlData[0]
          this.returnedData.QuizName = sqlData.QuizName;
          this.returnedData.QuizDifficulty = sqlData.QuizDifficulty;
          this.returnedData.AnswerRating = sqlData.AnswerRating;
          this.returnedData.QuizImage = sqlData.QuizImage;
          sqlData = await AxiosGet( `select * from Questions where QuizIDFK=`+this.quizID);

          for (let i=0;i<sqlData.length;i++){
           // let obj =  {  "Question": sqlData[i].Question,"Type": sqlData[i].QuestionType,"AnswerRating":  sqlData[i].AnswerRating,"Answers": JSON.parse(sqlData[i].Answers)};
            this.returnedData.Questions[i] = new QuestionClass(sqlData[i].Question,sqlData[i].QuestionType,sqlData[i].AnswerRating,JSON.parse(sqlData[i].Answers));
            this.returnedData.Questions[i].playerAnswer = "";
          }
        } else {
          
          this.$router.push({ name: 'Home'});
        }
        
        this.update = true;
        this.update = false;
      }
    },
    SubmitAnswers(){
      console.log(this.returnedData)
    },
    async ReturnAnswerData(index,playerAnswer){
      this.returnedData.Questions[index].playerAnswer = playerAnswer;
    }
  },
};
</script>
<style scoped>
  .questionContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute; 
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  #Background {
      background: url('../assets/bg_login_modified_dark.jpg') no-repeat center center fixed !important;
   }      
   #BgTransparent,#quizCreate,#quizEdit{
    background-color: #3e3e3ed5;
   }  
</style>