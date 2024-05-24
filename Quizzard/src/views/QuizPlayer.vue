<script setup>
import SideBar from "../components/Navbar.vue";
import PlayerCard from "../components/PlayerCard.vue";
import OpenAI from "openai";
import QuestionClass from "../classes/QuestionClass.js";
import AxiosGet from "../JavaScript/AxiosGet.js";
import ChartComponent from "../components/ChartComponent.vue"
</script>

<template>
  <v-app id="Background">
    <SideBar></SideBar>
    <v-main class="d-flex align-center justify-center">
      <v-card width="80vw"  height="fit-content" class="d-flex align-center flex-column" id="quizEdit" elevation="12">
        <v-toolbar color="primary" style="text-align: center">  
          <v-toolbar-title>
            {{ returnedData.QuizName }}
            <p>{{ playtime }}</p>
          </v-toolbar-title>
        </v-toolbar> 
        <v-container v-if="playing==0" width="75vw" class="d-flex align-center flex-column">
          <v-container class="d-flex flex-column align-center justify-center flex-shrink-1"  >
            <v-container width="fit-content" class="d-flex flex-row align-center justify-center">
              <v-btn value="submit" :disabled="loading" :loading="loading" v-on:click="timer" class="mt-4  text-h3" height="auto" color="button">
                Start Quiz
              </v-btn>
            </v-container>
            <p class="mb-3">{{ loadingMessage }}</p>
          </v-container>
        </v-container>      
        <v-container v-if="playing==1" width="75vw" class="d-flex align-center flex-column">
          <v-card width="75vw"  height="55vh" elevation="0" id="BgTransparent"  class="mt-5 pl-4 pr-4 overflow-y-auto">
            <v-expansion-panels >
              <PlayerCard class="fill-height mt-3" v-for="(item, index) in returnedData.Questions" :key="item.title" cols="auto"
                :returnAnswerData="ReturnAnswerData"
                :question="item.Question"
                :index="index"
                :questionType="item.QuestionType"
                :answerRating="item.AnswerRating"
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
        <v-container v-if="playing==2" width="75vw" class="d-flex align-center flex-column">
          <v-card width="75vw"  height="55vh" elevation="0" id="BgTransparent"  class="mt-5 pl-4 pr-4 overflow-y-auto">
            <v-expansion-panels >
              <PlayerCard class="fill-height mt-3" v-for="(item, index) in returnedData.Questions" :key="item.title" cols="auto"
                :returnAnswerData="ReturnAnswerData"
                :question="`[ ${item.Points} / 1 ] -- ${item.Question}`"
                :index="index"
                :questionType="item.QuestionType"
                :answers="item.Answers"
                :answerRating="item.AnswerRating"
                :playerAnswer="item.playerAnswer"
                :enabled="false"
              ></PlayerCard>
            </v-expansion-panels>
          </v-card> 
          <v-container class="d-flex flex-column align-center justify-center flex-shrink-1"  >
            <h1 class="mb-1">{{ rating }} / {{this.returnedData.Questions.length}} Points</h1>
            <ChartComponent :pData="playData" :plotEnabled="pEnabled"></ChartComponent>
            <v-container width="fit-content" class="d-flex flex-row align-center justify-center">
              <v-btn value="submit" :disabled="loading" :loading="loading" v-on:click="replay" class="mt-4 mr-5 text-h3" height="auto" color="buttonsecond">
                Replay Quiz
              </v-btn>
              <v-btn value="submit" :disabled="loading" :loading="loading" v-on:click="home" class="mt-4  text-h3" height="auto" color="button">
                Home
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
    playtime:0,
    loading: false,
    update: false,
    pEnabled: true,
    playing: 0,
    quizID: -1,
    rating: 0,
    panel: [0],
    returnedData: 
      {"QuizName": "Your Quiz Name",
      "QuizDifficulty": 0, // easy=0; medium=1; difficult=2
      "QuizImage": "image.png",
      "Questions": []
    },
    playData: {},
  }),
  methods: { 
    async Initialize(){
      if(this.$route.params.quizID){
        this.quizID = this.$route.params.quizID;
        this.returnedData.AnswerRating = 0;
        var userId = await AxiosGet(`select UserID from Users where Token='`+localStorage.getItem('token')+`';`)
        var sqlData = await AxiosGet(`select * from Quizzes where QuizID=${this.quizID};`);
        if (sqlData) {
          sqlData = sqlData[0]
          if (sqlData.Public.data[0] == true || sqlData.UserIDFK == userId[0].UserID){
            this.returnedData.QuizName = sqlData.QuizName;
            this.returnedData.QuizDifficulty = sqlData.QuizDifficulty;
            this.returnedData.AnswerRating = sqlData.AnswerRating;
            this.returnedData.QuizImage = sqlData.QuizImage;
            sqlData = await AxiosGet( `select * from Questions where QuizIDFK=`+this.quizID);

            for (let i=0;i<sqlData.length;i++){
            // let obj =  {  "Question": sqlData[i].Question,"Type": sqlData[i].QuestionType,"AnswerRating":  sqlData[i].AnswerRating,"Answers": JSON.parse(sqlData[i].Answers)};
              this.returnedData.Questions[i] = new QuestionClass(sqlData[i].Question,sqlData[i].QuestionType,sqlData[i].AnswerRating,JSON.parse(sqlData[i].Answers));
              if (this.returnedData.Questions[i].QuestionType == 1){
                this.returnedData.Questions[i].playerAnswer = 0;
              } else {
                this.returnedData.Questions[i].playerAnswer = "";
              }
            }
          } else {
            this.$router.push({ name: 'Home'});
          }
        } else {
          this.$router.push({ name: 'Home'});
        }
      
        
        this.update = true;
        this.update = false;
      }
    },
    async APICall(question){
     
    },
    timer() {
      this.playing = 1;
      this.playtime = 0;
      const startTime = Date.now();

      const self = this
      let interval = setInterval(function() {
        if(self.playing == 1){
          self.playtime = Date.now() - startTime ;
          self.playtime = (self.playtime / 1000).toFixed(1)
        } else {
          return
        }
      }, 100);
    },

    async SubmitAnswers(){
      const self = this;
      this.playing = 3
      for (const question of this.returnedData.Questions) {
        if(question.QuestionType == 1){
          if(question.AnswerRating==question.playerAnswer){
            self.rating += 1
            question.Points = 1
          } else {
            question.Points = 0
          }
          //question.playerAnswer = question.AnswerRating
        } else {
          question.Points = 0
          if(question.AnswerRating == 0){ // content

            if(question.playerAnswer != ""){
              const openai = new OpenAI({ apiKey: import.meta.env.VITE_API_KEY, dangerouslyAllowBrowser: true });
              async function main() {
                const completion = await openai.chat.completions.create({
                  messages: [{ role: "system", content: `Return 1 if the meaning of "`+question.playerAnswer+`" is similar to/has the same meaning as "`+question.Answers[0]+`". Does the context match? Be very stict about returning 1. If it is not similar return 0`}],
                  model: "gpt-3.5-turbo",
                });
                if (completion.choices[0]) {
                  console.log(completion.choices[0].message,question.playerAnswer,question.Answers[0]);
                  self.rating += JSON.parse(completion.choices[0].message.content);
                  question.Points = JSON.parse(completion.choices[0].message.content);
                }
              }
              await main();
              console.log("done")
            }
          } else { // Exact
            let plrAnswer = question.playerAnswer
            if(plrAnswer.toLowerCase() == question.Answers[0].toLowerCase()){
              self.rating += 1
              question.Points = 1
            }
          }
        } 
      }
      this.playing = 2
      console.log("new page")
      if (localStorage.getItem("token") != ""){
        var userId = await AxiosGet(`select UserID from Users where Token='`+localStorage.getItem('token')+`';`)
        await AxiosGet(`insert into Plays (UserIDFK,QuizIDFK,Points,MaxPoints,Playtime,Playdate) VALUES (${userId[0].UserID},${this.quizID},${this.rating},${this.returnedData.Questions.length},${this.playtime},'${new Date().toISOString().slice(0, 19).replace('T', ' ')}');`)
        this.playData = await AxiosGet(`select Points,MaxPoints,Playtime,Playdate from Plays where UserIDFK = ${userId[0].UserID} and QuizIDFK = ${this.quizID} ORDER BY Playdate DESC limit 10;`)
      } else {
        this.pEnabled = false
      }
    },
    async ReturnAnswerData(index,playerAnswer){
      this.returnedData.Questions[index].playerAnswer = playerAnswer;
    },
    replay() {
      window.location.reload()
    },
    home() {
      this.$router.push({ name: "Home"});
    },
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