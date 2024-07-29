<template>
  <div class="heading">
    <h2>Вопросы и ответы</h2>
    <button @click="toggleActionsState">
      {{ actionsState ? "preview" : "edit" }}
    </button>
  </div>
  <div v-if="items.length === 0">
    <p class="empty">
      Тут пока ничего нет. Перейдите в
      <span @click.stop="toggleActionsState">режим редактирования</span> и
      добавьте свой первый вопрос
    </p>
  </div>
  <div v-for="item in items" key="item.id">
    <div class="question-wrapper">
      <div
        :class="[
          'question',
          { 'border-active': item.isActive || item.isFixed },
        ]"
        @click="toggleItem(item.id)"
      >
        <div class="question-text">
          {{ item.question }}
        </div>

        <div>
          <button
            class="buttons btn-edit"
            v-if="actionsState"
            @click.stop="openPopup(item)"
          >
            edit
          </button>
          <button
            class="buttons btn-del"
            v-if="actionsState"
            @click.stop="deleteItem(item.id)"
          >
            del
          </button>
          <i :class="iconClass(item)"></i>
        </div>
      </div>
      <div class="answer" v-if="item.isActive || item.isFixed">
        {{ item.answer }}
        <router-link
          :to="{ name: 'Detailes', params: { id: item.id } }"
          class="more"
          >Подробнее...</router-link
        >
      </div>
    </div>
  </div>
  <div v-if="actionsState">
    <button class="add-btn" @click="openAddPopup">
      Добавить<i class="fas fa-plus"></i>
    </button>
  </div>

  <div v-if="isPopupOpen" class="popup">
    <div class="popup-content">
      <div class="popup-heading">
        <h3>{{ isAddPopup ? "Создать вопрос" : "Редактировать вопрос" }}</h3>
        <button @click="closePopup">close</button>
      </div>
      <label for="input-question"> Вопрос: </label>
      <input v-model="currentQuestion" id="input-question" class="input" />
      <label for="input-answer"> Ответ: </label>
      <textarea
        v-model="currentAnswer"
        id="input-answer"
        class="textarea"
      ></textarea>
      <div v-if="!isAddPopup" class="checkbox-wrapper">
        <input
          v-model="currentIsFixed"
          id="checkbox"
          class="checkbox"
          type="checkbox"
        />
        <label for="checkbox">Закрепить наверху</label>
      </div>
      <button class="save-btn" @click="saveChanges">Сохранить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAccordionService } from "../services/AccordionService";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { IAccordionItem } from "../interfaces/IAccordionItem";

const AccordionService = useAccordionService();
const items = ref<IAccordionItem[]>([]);
const isPopupOpen = ref(false);

const currentQuestion = ref("");
const currentAnswer = ref("");
const currentIsFixed = ref(false);
const currentId = ref("");
const isAddPopup = ref(false);

let actionsState = ref(false);

const iconClass = (item: any) => {
  if (item.isFixed) {
    return "fas fa-thumbtack";
  } else if (item.isActive) {
    return "fas fa-minus";
  } else {
    return "fas fa-plus";
  }
};

const toggleActionsState = () => {
  actionsState.value = !actionsState.value;
};

const openPopup = (item: any) => {
  currentQuestion.value = item.question;
  currentAnswer.value = item.answer;
  currentId.value = item.id;
  currentIsFixed.value = item.isFixed;
  isPopupOpen.value = true;
};

const openAddPopup = () => {
  currentQuestion.value = "";
  currentAnswer.value = "";
  currentId.value = "";
  currentIsFixed.value = false;
  isPopupOpen.value = true;
  isAddPopup.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  isAddPopup.value = false;
};

const saveChanges = async () => {
  if (currentId.value) {
    await AccordionService.updateItem(
      currentId.value,
      currentQuestion.value,
      currentAnswer.value,
      currentIsFixed.value
    );
  } else {
    await AccordionService.addItem(currentQuestion.value, currentAnswer.value);
  }
  items.value = await AccordionService.getSortedItems();
  closePopup();
};

const toggleItem = async (id: string) => {
  await AccordionService.toggleItem(id);
  items.value = await AccordionService.getSortedItems();
};

const deleteItem = async (id: string) => {
  await AccordionService.deleteItem(id);
  items.value = await AccordionService.getSortedItems();
};

onMounted(async () => {
  items.value = await AccordionService.getSortedItems();
});
</script>

<style>
.question-wrapper {
  margin-bottom: 10px;
}

.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 11px;
  margin-top: 19px;
}

.heading h2 {
  margin: 0;
  font-size: 18px;
  line-height: 12px;
  font-weight: 700;
  color: black;
}

.heading button {
  font-size: 12px;
  line-height: 12px;
  color: rgba(27, 133, 209, 1);
  background-color: rgba(238, 238, 238, 1);
  border: none;
  text-decoration: none;
}

.buttons {
  display: inline-block;
  vertical-align: middle;
  padding: 0;
  width: 40px;
  height: 16px;
  font-size: 12px;
  line-height: 14px;
  border: none;
  border-radius: 5px;
}

.btn-del {
  background-color: rgba(215, 67, 94, 1);
  margin-left: 8px;
  margin-right: 5px;
}

.btn-edit {
  background-color: rgba(0, 179, 255, 1);
}

.question {
  background-color: rgba(27, 133, 209, 1);
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
}

.question-text {
  text-align: left;
  max-width: 193px;
}

.border-active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.answer {
  background-color: #fff;
  color: black;
  padding: 8px;
  text-align: left;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.more {
  display: block;
  color: rgba(27, 133, 209, 1);
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  margin-top: 8px;
}

.add-btn {
  width: 100%;
  height: 26px;
  border: 1px solid rgba(51, 132, 206, 1);
  border-radius: 5px;
  background-color: rgba(86, 162, 233, 1);
  color: #fff;
  font-size: 14px;
  line-height: 18px;
}

.empty {
  width: 259px;
  margin: 44px auto 11px;
  color: rgba(119, 119, 119, 1);
  font-size: 14px;
  line-height: 18px;
  text-align: center;
}

.empty span {
  color: rgba(27, 133, 209, 1);
}

.fas {
  margin-left: 8px;
  font-size: 12px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  color: black;
  background-color: white;
  padding: 13px 15px 19px;
  border-radius: 10px;
  width: 316px;
}

.popup-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.popup-heading h3 {
  font-size: 14px;
  line-height: 12px;
  font-weight: 700;
  margin: 0;
}

.popup-heading button {
  font-size: 12px;
  line-height: 12px;
  background-color: #fff;
  color: black;
  border: none;
  padding: 0;
  margin: 0;
}

.popup-content label {
  display: block;
  font-size: 12px;
  line-height: 12px;
  text-align: left;
}

.popup-content .input {
  background-color: #fff;
  color: black;
  outline: rgba(109, 109, 109, 1);
  border: 1px solid rgba(109, 109, 109, 1);
  border-radius: 5px;
  margin: 0;
  padding: 0 5px;
  margin-top: 4px;
  margin-bottom: 11px;
  width: 100%;
  height: 26px;
}

.popup-content .textarea {
  resize: none;
  background-color: #fff;
  color: black;
  outline: rgba(109, 109, 109, 1);
  border: 1px solid rgba(109, 109, 109, 1);
  border-radius: 5px;
  margin: 0;
  padding: 0 5px;
  margin-top: 4px;
  width: 100%;
  height: 58px;
  margin-bottom: 16px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 18px;
}

.checkbox {
  appearance: none;
  margin: 0;
  padding: 0;
  width: 16px;
  height: 16px;
  display: inline-block;
  border: 1px solid rgba(109, 109, 109, 1);
  border-radius: 5px;
  cursor: pointer;
}

.checkbox:checked::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background-color: rgba(109, 109, 109, 1);
  border-radius: 2px;
  position: relative;
  top: 2px;
  left: 2px;
}

.popup-content .save-btn {
  color: #fff;
  background-color: rgba(86, 162, 233, 1);
  width: 100%;
  height: 26px;
  margin: 0;
  padding: 0;
  font-size: 14px;
  line-height: 18px;
  border: 1px solid rgba(51, 132, 206, 1);
  border-radius: 5px;
}
</style>
