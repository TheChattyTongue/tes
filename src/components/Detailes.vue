<template>
  <div>
    <div>
      <router-link :to="{ name: 'Accordion' }" class="back"
        >< На главную</router-link
      >
    </div>
    <div>
      <h2 class="question-detail">{{ question }}</h2>
      <p class="answer-detail">{{ answer }}</p>
    </div>
    <div class="action-btns">
      <button class="buttons btn-edit">edit</button>
      <button class="buttons btn-del">del</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAccordionStore } from "../store/accordion";

const route = useRoute();
const store = useAccordionStore();
const itemId = route.params.id;

const item = computed(() => {
  return store.items.find((item) => item.id === itemId);
});

const question = computed(() => item.value?.question || "");
const answer = computed(() => item.value?.answer || "");
</script>

<style>
.back {
  display: block;
  color: black;
  font-size: 18px;
  line-height: 12px;
  text-align: left;
  margin-top: 6px;
  margin-bottom: 24px;
}

.question-detail {
  color: black;
  font-size: 18px;
  line-height: 12px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 24px;
  text-align: left;
}

.answer-detail {
  color: black;
  font-size: 16px;
  line-height: 20px;
  text-align: left;
  margin: 0;
  margin-bottom: 14px;
}

.action-btns {
  text-align: left;
}
</style>
