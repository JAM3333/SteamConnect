<script setup>
import SideBar from "../components/Navbar.vue";
import QuestionCard from "../components/QuestionCard.vue";
import OpenAI from "openai";
import axios from 'axios';
import QuestionClass from "../classes/QuestionClass.js";
import AxiosGet from "../JavaScript/AxiosGet.js";
</script>

<template>
  <v-app id="Background">
    <SideBar></SideBar>
    <v-main class="d-flex align-center justify-center">
      <v-card width="80vw" height="fit-content" class="d-flex align-center flex-column" id="quizCreate" elevation="12">
        <v-toolbar color="primary" title="Create your Quiz"></v-toolbar>
        <v-container width="75vw" height="fit-content" class="d-flex align-center flex-column">
          <v-card width="75vw" outlined color="transparent" class="mt-5 mb-4">
            <v-toolbar
              class="text-medium-emphasis font-weight-light"
              color="primary"
              title="Upload your files"
            ></v-toolbar>
            
            <v-file-input
              class="mt-4"
              clearable
              label="File input"
              variant="outlined"
              multiple
              show-size
              name="fileo"
              @change="ReadFiles"
              ref="fileUpload"
            ></v-file-input>
          </v-card>
          <v-expansion-panels v-model="panel" style="min-width: 75vw">
            <v-expansion-panel expand title="Quiz Options"  color="primary">
              <v-expansion-panel-text :style="{background: $vuetify.theme.themes.background}">
                <v-card class="pa-4 d-flex align-center">
                  <span class="text-medium-emphasis ms-1 font-weight-light">
                    Quiz Difficulty
                  </span>

                  <v-spacer></v-spacer>

                  <v-btn-toggle
                    rounded="4"
                    color="button"
                    v-model="difSelectedButton"
                    group
                    mandatory
                  >
                    <v-btn value="easy"> EASY </v-btn>

                    <v-btn value="medium"> MEDIUM </v-btn>

                    <v-btn value="difficult"> DIFFICULT </v-btn>
                  </v-btn-toggle>
                </v-card>
                <v-card class="pa-4 d-flex align-center fit-content">
                  <span class="text-medium-emphasis ms-1 font-weight-light">
                    Question Count
                  </span>

                  <v-spacer></v-spacer>

                  <v-card class="d-flex mr-4  .justify-space-between flex-column" width="20vw">
                    <v-toolbar
                      class="text-medium-emphasis font-weight-light"
                      color="secondary"
                      title="Multiple Choice"
                    ></v-toolbar>
                    <v-slider
                      v-model="sliderMultipleChoice"
                      :max="sliderMax"
                      :min="sliderMin"
                      :step="1"
                      class="pl-2"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="sliderMultipleChoice"
                          hide-details
                          single-line
                          :max="sliderMax"
                          :min="sliderMin"
                          :step="1"
                          density="compact"
                          type="number"
                          style="width: 5vw"
                        ></v-text-field>
                      </template>
                    </v-slider>                  
                  </v-card>     
                  <v-card class="d-flex mr-4  .justify-space-between flex-column" width="20vw">
                    <v-toolbar
                      class="text-medium-emphasis font-weight-light"
                      color="secondary"
                      title="Text"
                    ></v-toolbar>
                    <v-slider
                      v-model="sliderText"
                      :max="sliderMax"
                      :min="sliderMin"
                      :step="1"
                      class="pl-2"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="sliderText"
                          hide-details
                          single-line
                          :max="sliderMax"
                          :min="sliderMin"
                          :step="1"
                          density="compact"
                          type="number"
                          style="width: 5vw"
                        ></v-text-field>
                      </template>
                    </v-slider>                  
                  </v-card>           
                </v-card>
                <v-card class="pa-4 d-flex align-center">
                  <span class="text-medium-emphasis ms-1 font-weight-light">
                    Answer Rating
                  </span>

                  <v-spacer></v-spacer>

                  <v-btn-toggle
                    rounded="4"
                    color="button"
                    v-model="answerSelectedButton"
                    group
                    mandatory
                  >
                    <v-btn value=0> Content (AI) </v-btn>

                    <v-btn value=1> Exact (Wording) </v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel
              expand
              title="Custom Instructions"
              color="primary"
            >
              <v-expansion-panel-text>
                <v-textarea label="Your instructions"></v-textarea>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn value="submit" v-on:click="GenerateQuiz"   :disabled="loading" :loading="loading" class="mt-4 mb-2 text-h3" height="auto" color="button">
            Generate Quiz
          </v-btn>
        </v-container>
      </v-card>
      <v-card width="80vw"  height="fit-content" class="d-none align-center flex-column" id="quizEdit" elevation="12">
        <v-toolbar color="primary" title="Quiz">  
          <v-text-field
            v-model="returnedData.QuizName"
            hide-details
            density="compact"
            type="text"
            class="mr-4"
          ></v-text-field>
        </v-toolbar> 
        <v-container width="75vw" class="d-flex align-center flex-column">
          <v-card width="75vw"  height="55vh" elevation="0" id="BgTransparent"  class="mt-5 pl-4 pr-4 overflow-y-auto">
            <v-expansion-panels >
              <QuestionCard class="fill-height mt-3" v-for="(item, index) in returnedData.Questions" :key="item.title" cols="auto"
                :updateQuestion="UpdateQuestion"
                :returnAnswerData="ReturnAnswerData"
                :removeQuestion="RemoveQuestion"
                :question="item.Question"
                :index="index"
                :type="item.Type"
                :answerRating="item.AnswerRating"
                :answers="item.Answers"
              ></QuestionCard>
              <v-btn v-on:click="AddQuestion" class="mt-8 mb-5" color="button"><v-icon class="mr-2" icon="mdi-plus-circle-outline"></v-icon> Add Question</v-btn>
            </v-expansion-panels>
          </v-card> 
          <v-container class="d-flex flex-column align-center justify-center flex-shrink-1"  >
            <v-container width="fit-content" class="d-flex flex-row align-center justify-center">
              <v-btn v-if="mode==0" value="submit" :disabled="loading" :loading="loading" v-on:click="CreateQuiz" class="mt-4  text-h3" height="auto" color="button">
                Create Quiz
              </v-btn>
              <v-btn v-else value="submit" :disabled="loading" :loading="loading" v-on:click="EditQuiz" class="mt-4 mb-2 text-h3" height="auto" color="button">
                Edit Quiz
              </v-btn>
              <v-card style="background-color: rgba(0,0,0,0)" class="d-flex align-center justify-center" elevation="0"><v-switch v-model="publicValue" label="Public" class="mt-8 ml-5" color="button"></v-switch></v-card>
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

export default {
  
  mounted(){
    this.Initialize();
   
  },
  data: () => ({
    loadingMessage:"",
    loading: false,
    mode: 0, //0=create; 1 = edit
    update: false,
    quizID: -1,
    fileData: [],
    customInstructions: "",
    publicValue: false,
    difSelectedButton: "medium",
    answerSelectedButton: 0, //ai=0; exact=1
    sliderMultipleChoice: 2,
    sliderText: 8,
    sliderMin: 0,
    sliderMax: 16,
    panel: [0],
    returnedData: 
      {"QuizName": "Your Quiz Name",
      "QuizDifficulty": 0, // easy=0; medium=1; difficult=2
      "QuizImage": "image.png",
      "Questions": []
    },
  }),
  methods: {
    ReadFiles() {
      const uploadedFiles = this.$refs.fileUpload.files;
      if (uploadedFiles.length > 0) {
        console.log(uploadedFiles[0]);
        this.fileData = [];
        for (let i = 0; i < uploadedFiles.length; i++) {
          var filetype = console.log(uploadedFiles[i].name);
          var reader = new FileReader();
          reader.readAsText(uploadedFiles[i]);
          reader.onload = () => {
            this.fileData.push([uploadedFiles[i].name, reader.result]);
          };
        }
        console.log(this.fileData);
      }
    },
    async APICall(){
       //WICHTIG !!!!!!!!!!
      //console.log(import.meta.env.VITE_API_KEY);
      const openai = new OpenAI({ apiKey: import.meta.env.VITE_API_KEY, dangerouslyAllowBrowser: true });

      async function main() {
        this.loadingMessage = "Sending prompt...";
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: `Generate a quiz from the attached file and the following instructions: ${this.customInstructions}. Create ${this.sliderText} Text-Questions and ${this.sliderMultipleChoice} Multiple-choice-questions with a difficulty of ${this.difSelectedButton} using the following json format (Example):   {"QuizName": "Name",
      "QuizDifficulty": 0, // easy=0; medium=1; difficult=2
      "QuizImage": "image.png",
      "Questions": [
        {
          "Question": "Multiple-Choice?",
          "Type": 1, // MultipleChoice = 1
          "AnswerRating": 3, // Richtige Antwort ist Answer 3
          "Answers": {
            "1": "Salz",
            "2": "Zucker",
            "3": "Backsoda",
            "4": "Wasser"
          }
        },
        {
          "Question": "Text-Question?",
          "Type": 0, // Text = 0
          "AnswerRating": ${this.answerSelectedButton}, // always use this with Text-Questions
          "Answers": {
            "1": "Viel Wasser"
          }
        },
      ]
    }`  }],
          model: "gpt-3.5-turbo",
      });

      console.log(completion.choices[0]);
      }

      main();
    },
    uploadFile() {
      const formData = new FormData();
      let fileUploadLength = this.$refs.fileUpload.files.length;

      for(let i=0;i<fileUploadLength;i++)
      {
        formData.append('file', this.$refs.fileUpload.files[i]);
      }

      axios.post('http://10.115.2.38:3002/api/Upload', formData)
        .then(response => {
          console.log(response.data);
      })
        .catch(error => {
          console.error('Error uploading file:', error);
      });
    },
    async GenerateQuiz(){
      this.loading = true
      this.loadingMessage = "Generating Quiz...";
      this.quizName = this.returnedData.QuizName;    
      this.returnedData.AnswerRating = parseInt(this.answerSelectedButton)
      this.returnedData.Questions.push(new QuestionClass("Wie backt man Fisch?",1,3,["Salz","Zucker","Backsoda","Wasser"]));   
      this.returnedData.Questions.push(new QuestionClass("Mit was sollte man Fisch backen?",0,1,["Salz"]));   
      //this.uploadFile();
      // await this.APICall(); 
      this.SwitchPage();
      this.loading = false
      this.loadingMessage = "";
    },
    async CreateQuiz(){
      if (this.mode==0){
        console.log(this.returnedData)
        this.loading = true;
        this.loadingMessage = "Creating Quiz...";
        var insertData = await AxiosGet(`insert into Quizzes (UserIDFK,QuizName,QuizDifficulty,AnswerRating,Public,QuizImage) VALUES (1,'${this.returnedData.QuizName}',${this.returnedData.QuizDifficulty},${this.returnedData.AnswerRating},${this.publicValue},'https://th.bing.com/th/id/R.385e7dbec0e6c313cfd6dc3b6fff1c95?rik=Ps5ZHpTWtX4y3A&pid=ImgRaw&r=0');`)
        //var insertData = await this.ApiGet(`insert into Quizzes (UserIDFK,QuizName,QuizDifficulty,AnswerRating,QuizImage) VALUES (1,'${this.returnedData.QuizName}',${this.returnedData.QuizDifficulty},${this.returnedData.AnswerRating},'https://th.bing.com/th/id/R.385e7dbec0e6c313cfd6dc3b6fff1c95?rik=Ps5ZHpTWtX4y3A&pid=ImgRaw&r=0');`)
        for (let i=0;i<this.returnedData.Questions.length;i++){
          this.loadingMessage = "Creating Question "+(parseInt(i)+1)+"...";
          this.returnedData.Questions[i].AnswerRating
          console
          await AxiosGet(`insert into Questions (QuizIDFK,Question,QuestionType,AnswerRating,Answers) VALUES (${insertData.insertId},'${this.returnedData.Questions[i].Question}',${this.returnedData.Questions[i].Type},${this.returnedData.Questions[i].AnswerRating},'${JSON.stringify(this.returnedData.Questions[i].Answers)}');`)
        } 
        this.loading = false
        this.$router.push({ name: 'Home'});
      } else {
        console.log(this.returnedData)
        this.loading = true;
        this.loadingMessage = "Creating Quiz...";
        var insertData = await AxiosGet(`insert into Quizzes (UserIDFK,QuizName,QuizDifficulty,AnswerRating,Public,QuizImage) VALUES (1,'${this.returnedData.QuizName}',${this.returnedData.QuizDifficulty},${this.returnedData.AnswerRating},${this.publicValue},'https://th.bing.com/th/id/R.385e7dbec0e6c313cfd6dc3b6fff1c95?rik=Ps5ZHpTWtX4y3A&pid=ImgRaw&r=0');`)
        //var insertData = await this.ApiGet(`insert into Quizzes (UserIDFK,QuizName,QuizDifficulty,AnswerRating,QuizImage) VALUES (1,'${this.returnedData.QuizName}',${this.returnedData.QuizDifficulty},${this.returnedData.AnswerRating},'https://th.bing.com/th/id/R.385e7dbec0e6c313cfd6dc3b6fff1c95?rik=Ps5ZHpTWtX4y3A&pid=ImgRaw&r=0');`)
        for (let i=0;i<this.returnedData.Questions.length;i++){
          this.loadingMessage = "Creating Question "+(parseInt(i)+1)+"...";
          await AxiosGet(`insert into Questions (QuizIDFK,Question,QuestionType,AnswerRating,Answers) VALUES (${insertData.insertId},'${this.returnedData.Questions[i].Question}',${this.returnedData.Questions[i].Type},${this.returnedData.Questions[i].AnswerRating},'${JSON.stringify(this.returnedData.Questions[i].Answers)}');`)
        } 
        this.loading = false
        this.$router.push({ name: 'Home'});
      }
    },
    async EditQuiz(){

    },
    SwitchPage(){
      document.getElementById('quizCreate').classList.remove("d-flex");
      document.getElementById('quizCreate').classList.add("d-none");
      document.getElementById('quizEdit').classList.remove("d-none");
      document.getElementById('quizEdit').classList.add("d-flex");
      this.quizName = this.returnedData.QuizName;          
    },
    async Initialize(){
      if(this.$route.params.quizID){
        this.mode = 1;
        this.quizID = this.$route.params.quizID;
        this.returnedData.AnswerRating = 0;
        this.SwitchPage();
        var sqlData = await AxiosGet(`select * from Quizzes where QuizID=${this.quizID} and UserIDFK=1`);
        if (sqlData[0].UserIDFK == 1){
          sqlData = sqlData[0]
          this.quizName = sqlData.QuizName;
          this.publicValue = sqlData.Public;
          this.returnedData.QuizName = sqlData.QuizName;
          this.returnedData.QuizDifficulty = sqlData.QuizDifficulty;
          this.returnedData.AnswerRating = sqlData.AnswerRating;
          this.returnedData.QuizImage = sqlData.QuizImage;
          sqlData = await AxiosGet( `select * from Questions where QuizIDFK=`+this.quizID);
          for (let i=0;i<sqlData.length;i++){
           // let obj =  {  "Question": sqlData[i].Question,"Type": sqlData[i].QuestionType,"AnswerRating":  sqlData[i].AnswerRating,"Answers": JSON.parse(sqlData[i].Answers)};
            this.returnedData.Questions[i] = new QuestionClass(sqlData[i].Question,sqlData[i].QuestionType,sqlData[i].AnswerRating,JSON.parse(sqlData[i].Answers));
          }
          console.log(this.returnedData.Questions)
        } else {
          this.$router.push({ name: 'Home'});
        }
        console.log(this.returnedData)
        this.update = true;
        this.update = false;
      } else {
        this.mode = 0;
      };
    },
    async UpdateQuestion(index,question,answerRating,type){
      this.returnedData.Questions[index].Question = question;
      this.returnedData.Questions[index].AnswerRating = answerRating;
      if (this.returnedData.Questions[index].Type != type){
        this.returnedData.Questions[index].Type = type;
        if (type == 0){
          this.returnedData.Questions[index].AnswerRating = parseInt(this.answerSelectedButton);
          this.returnedData.Questions[index].Answers = [this.returnedData.Questions[index].Answers[0]]
        } else {
          this.returnedData.Questions[index].AnswerRating = 1;
          this.returnedData.Questions[index].Answers = [this.returnedData.Questions[index].Answers[0],"","",""]
        }
      }
    },
    RemoveQuestion(index){
      this.returnedData.Questions.splice(index,1);
    },
    AddQuestion(){
      this.returnedData.Questions.push(new QuestionClass("",0,this.returnedData.AnswerRating,[""]));   
    },
    async ReturnAnswerData(index,answers){
      this.returnedData.Questions[index].Answers = answers;
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