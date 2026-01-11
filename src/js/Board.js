import Card from "./Card";
import AddCardForm from "./AddCardForm";
import DragAndDrop from "./DragAndDrop";

export default class Board {
  constructor() {
    this.LOCAL_STORAGE_KEY = "board";
    this.container = document.querySelector(".container");
    this.card = new Card();
    this.addForm = new AddCardForm();
    this.dragAndDrop = new DragAndDrop(this.container, () => this.saveState());
    this.data = this.loadState() || {
      todo: [],
      in_progress: [],
      done: [],
    };
  }

  init() {
    this.render();

    this.container.addEventListener("click", this.onClick);

    document.documentElement.addEventListener("mouseover", this.onMouseover);
    document.documentElement.addEventListener("mouseout", this.onMouseout);
  }

  onClick = (event) => {
    event.preventDefault();
    const openFormButton = event.target.classList.contains("open-add-form-btn");
    const closeFormButton =
      event.target.classList.contains("close-add-form-btn");
    const addCardButton = event.target.classList.contains("create-card-btn");
    const deleteCardButton = event.target.classList.contains("delete-card-btn");

    if (openFormButton) {
      this.addForm.addCardForm(event.target);
    } else if (closeFormButton) {
      this.addForm.closeCardForm(event.target);
    } else if (addCardButton) {
      const input = document.querySelector(".card-input");
      const cardList = event.target
        .closest(".column")
        .querySelector(".card-list");
      cardList.append(this.card.createCard(input.value));

      this.addForm.closeCardForm(event.target);
      this.saveState();
    } else if (deleteCardButton) {
      event.target.closest(".card").remove();
    }
  };

  onMouseover = (event) => {
    const card = event.target.closest(".card");
    if (card && !this.dragAndDrop.draggedCard) {
      if (!card.querySelector(".delete-card-btn")) {
        card.append(this.card.createDeleteButton());
      }
    }
  };

  onMouseout = (event) => {
    const card = event.target.closest(".card");
    if (card && !card.contains(event.relatedTarget)) {
      const button = card.querySelector(".delete-card-btn");
      if (button) button.remove();
    }
  };

  loadState() {
    const data = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  saveState() {
    console.log("save");
    const columns = {
      todo: this.getColumnData("todo"),
      in_progress: this.getColumnData("in_progress"),
      done: this.getColumnData("done"),
    };

    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(columns));
  }

  getColumnData(columnName) {
    const column = this.container.querySelector(
      `[data-column-name="${columnName}"]`,
    );
    if (!column) return [];

    return Array.from(column.querySelectorAll(".card-text")).map(
      (card) => card.textContent,
    );
  }

  render() {
    Object.entries(this.data).forEach(([columnName, cards]) => {
      const columnEl = this.container.querySelector(
        `[data-column-name="${columnName}"]`,
      );
      if (!columnEl) return;

      const cardsContainer = columnEl.querySelector(".card-list");
      cardsContainer.innerHTML = "";

      cards.forEach((cardText) => {
        cardsContainer.append(this.card.createCard(cardText));
      });
    });
  }
}
