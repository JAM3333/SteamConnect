<script setup>
  import QuizCreator from "../views/QuizCreator.vue";
</script>

<template>
  <v-expansion-panel
    color="primary"
  >
    <v-expansion-panel-title>
      <div  v-if="questionType==0">
      <v-btn v-if="answerRating==0" value:0 disabled> Content </v-btn>
        <v-btn v-else value:1 disabled> Exact </v-btn>
      </div>
      <v-btn v-else value:1 disabled> Multiple Choice </v-btn>

      <p class="ml-5">{{ question }}</p>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div class="d-flex flex-row justify-space-between" v-for="(item, indexAnswer) in answers">
        <v-text-field v-if="questionType==0" class="flex-grow-1"
          label="Your Answer"
          :disabled="!this.enabled"
          v-model="playerAnswerNew"
          @blur="updateAnswerData"
        ></v-text-field> 
        <v-text-field v-if="questionType==0 && !this.enabled" class="flex-grow-1"
          label="Correct Answer"
          :disabled="!this.enabled"
          v-model="answerRatingNew"
          @blur="updateAnswerData"
        ></v-text-field> 
      </div>       
      <div class="d-flex flex-column align-center">
      <v-btn-toggle v-if="questionType==1" 
          rounded="4"
          color="button"
          :disabled="!this.enabled"
          v-model="playerAnswerNew"
          @click="updateAnswerData"
          mandatory
          class="d-flex flex-wrap flex-row justify-space-between"
          style="height: fit-content;"
        >
          <v-btn class="pt-4 pb-4" value:0> {{answers[0]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:1> {{answers[1]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:2> {{answers[2]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:3> {{answers[3]}} </v-btn> 
        </v-btn-toggle>
        <v-btn-toggle v-if="questionType==1 && !this.enabled" 
          rounded="4"
          color="buttonGreen"
          :disabled="!this.enabled"
          v-model="answerRatingNew"
          mandatory
          class="d-flex flex-wrap flex-row justify-space-between"
          style="height: fit-content;"
        >
          <v-btn class="pt-4 pb-4" value:0> {{answers[0]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:1> {{answers[1]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:2> {{answers[2]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:3> {{answers[3]}} </v-btn> 
        </v-btn-toggle>
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
   
<script>

export default {
  props: {
    returnAnswerData: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    questionType: {
      type: Number,
      required: true,
    },
    answers: {
      type: Object,
      required: false,
    },
    playerAnswer: {
      type: Object,
      required: false,
    },
    answerRating: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
  mounted(){
    if (this.questionType == 1){
      this.answerRatingNew = this.answerRating
      this.playerAnswerNew = this.playerAnswer
      if (this.enabled){
        this.playerAnswerNew = 0
      }
    } else {
      this.answerRatingNew = this.answers[0]
      this.playerAnswerNew = this.playerAnswer
      if (this.enabled){
        this.playerAnswerNew = ""
      }
    }
  },
  data: () => ({
    update: false,
    playerAnswerNew: "",
    answerRatingNew: 0,
  }),
  methods: {
    async updateAnswerData(){
      await this.returnAnswerData(this.index,this.playerAnswerNew);
      this.playerAnswerNew = this.playerAnswer;

    }
  }
}
</script>