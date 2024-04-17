<script setup>
  import QuizCreator from "../views/QuizCreator.vue";
</script>

<template>
  <v-expansion-panel
    color="primary"
  >
    <v-expansion-panel-title> {{ question }}
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <div class="d-flex flex-row justify-space-between" v-for="(item, indexAnswer) in answers">
        <v-text-field v-if="type==0" class="flex-grow-1"
        label="Your Answer"
        v-model="playerAnswerNew"
        @blur="updateAnswerData"
        ></v-text-field> 
      </div>
      <div class="d-flex flex-column align-center">
      <v-btn-toggle v-if="type==1"
          rounded="4"
          color="button"
          v-model="playerAnswerNew"
          @click="updateAnswerData"
          mandatory
          class="d-flex flex-wrap flex-row justify-space-between"
          style="height: fit-content;"
        >
          <v-btn class="pt-4 pb-4" value:1> {{answers[0]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:2> {{answers[1]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:3> {{answers[2]}} </v-btn>
          <v-btn class="pt-4 pb-4" value:4> {{answers[3]}} </v-btn> 
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
    type: {
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
  },
  mounted(){
    if (this.type == 1){
      this.playerAnswerNew = 0
    }
  },
  data: () => ({
    update: false,
    playerAnswerNew: "",
  }),
  methods: {
    async updateAnswerData(){
      await this.returnAnswerData(this.index,this.playerAnswerNew);
      this.playerAnswerNew = this.playerAnswer;
    }
  }
}
</script>