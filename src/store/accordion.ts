import { defineStore } from "pinia";
import { IAccordionItem } from "../interfaces/IAccordionItem";
import { v4 as uuidv4 } from "uuid";

export const useAccordionStore = defineStore("accordion", {
  state: () => ({
    items: JSON.parse(
      localStorage.getItem("items") || "[]"
    ) as IAccordionItem[],
  }),
  actions: {
    addItem(question: string, answer: string) {
      this.items.push({
        id: uuidv4(),
        question,
        answer,
        isActive: false,
        isFixed: false,
      });
      this.saveItems();
    },
    toggleItem(id: string) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.isActive = !item.isActive;
        this.saveItems();
      }
    },
    saveItems() {
      localStorage.setItem("items", JSON.stringify(this.items));
    },
    deleteItem(id: string) {
      this.items = this.items.filter((item) => item.id !== id);
      this.saveItems();
    },
    updateItem(id: string, question: string, answer: string, isFixed: boolean) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.question = question;
        item.answer = answer;
        item.isFixed = isFixed;
        item.isActive = isFixed;
        this.saveItems();
      }
    },
    resetItems() {
      this.items = [];
      this.saveItems();
    },
  },
});
