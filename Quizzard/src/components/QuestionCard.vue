<script setup>
  import QuizCreator from "../views/QuizCreator.vue";
</script>

<template>
  <v-expansion-panel
    color="primary"
  >
    <v-expansion-panel-title>
      <v-btn
        class="mr-2"
        icon="mdi-delete"
        color="#933"       
        @click.stop="removeQuestion(index)"
      ></v-btn>
      <v-text-field
        v-model="questionNew"
        hide-details
        @input.stop="updateUI"
        density="compact"
        type="text"
        class="mr-4"
      ></v-text-field>
      <v-card v-if="questionType==0" class="d-flex mr-3 align-center">
        <v-spacer></v-spacer>
        <v-btn-toggle
          rounded="4"
          color="button"
          v-model="answerRatingNew"
          @click.stop="updateUI"
          group
          mandatory
        >
          <v-btn value:0> Content (AI) </v-btn>
          <v-btn value:1> Exact (Wording) </v-btn>
        </v-btn-toggle>
      </v-card>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div class="d-flex flex-row .justify-space-between" v-for="(item, indexAnswer) in answers">
        <v-text-field class="flex-grow-1"
        :label="`Answer ${parseInt(indexAnswer)+1}`"
        v-model="answersNew[parseInt(indexAnswer)]"
        @blur="updateAnswerData"
        ></v-text-field> 
        <v-checkbox v-if="typeNew==1" class="flex-grow-0 ml-2" :value=indexAnswer v-model="answerRatingNew" @input="updateAnswerRating"
        ></v-checkbox>
      </div>
        <v-container class="d-flex align-center justify-center flex-column pt-0 pb-0">
        <v-btn-toggle
          rounded="4"
          color="button"
          v-model="typeNew"
          @click.stop="updateUI"
          group
          mandatory
        >
          <v-btn value:0> Text </v-btn>
          <v-btn value:1> Multiple Choice </v-btn>
        </v-btn-toggle>
      </v-container>
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
    updateQuestion: {
      type: Function,
      required: true,
    },
    removeQuestion: {
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
    answerRating: {
      type: Number,
      required: true,
    },
    answers: {
      type: Object,
      required: false,
    },
  },
  mounted(){
    this.questionNew = this.question;
    this.typeNew = this.questionType;
    this.answerRatingNew = this.answerRating;
    this.answersNew[0] = this.answers[0];
    if (this.answers[1] != undefined) {
      this.answersNew[1] = this.answers[1];
      this.answersNew[2] = this.answers[2];
      this.answersNew[3] = this.answers[3];
    }
  },
  data: () => ({
    update: false,
    answerRatingNew:0,
    answersNew: [],
    typeNew: 0,
    questionNew: "",
  }),
  methods: {
    async updateUI(){
      await this.updateQuestion(this.index,this.questionNew,this.answerRatingNew,this.typeNew);
      this.answersNew = []
      this.answersNew[0] = this.answers[0];
      if (this.answers[1] != undefined) {
        this.answersNew[1] = this.answers[1];
        this.answersNew[2] = this.answers[2];
        this.answersNew[3] = this.answers[3];
      }
      this.typeNew = this.questionType;
      this.answerRatingNew = parseInt(this.answerRating);
    },
    async updateAnswerRating(){
      if (!this.answerRatingNew){
        this.answerRatingNew = 0;
      }
      await this.updateUI()
    },
    async updateAnswerData(){
      await this.returnAnswerData(this.index,this.answersNew);
      console.log(this.answersNew)
      this.answersNew[0] = this.answers[0];
      if (this.answers[1] != undefined) {
        this.answersNew[1] = this.answers[1];
        this.answersNew[2] = this.answers[2];
        this.answersNew[3] = this.answers[3];
      }
    }
  }
}
</script>