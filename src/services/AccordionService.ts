import { useAccordionStore } from "../store/accordion";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useAccordionService = () => {
  const store = useAccordionStore();

  const addItem = async (question: string, answer: string) => {
    await delay(500);
    store.addItem(question, answer);
  };

  const updateItem = async (
    id: string,
    question: string,
    answer: string,
    isFixed: boolean
  ) => {
    await delay(500);
    store.updateItem(id, question, answer, isFixed);
  };

  const deleteItem = async (id: string) => {
    await delay(500);
    store.deleteItem(id);
  };

  const toggleItem = async (id: string) => {
    await delay(500);
    store.toggleItem(id);
  };

  const getSortedItems = async () => {
    await delay(500);
    return [...store.items].sort(
      (a, b) => Number(b.isFixed) - Number(a.isFixed)
    );
  };

  return {
    addItem,
    updateItem,
    deleteItem,
    toggleItem,
    getSortedItems,
  };
};
