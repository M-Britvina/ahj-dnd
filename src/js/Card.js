export default class Card {
  constructor() {}

  createCard(text) {
    const card = document.createElement("div");
    card.classList.add("card");

    // card.append(this.createDeleteButton());
    card.append(this.createText(text));

    return card;
  }

  createDeleteButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("delete-card-btn");
    button.innerText = "🞩";
    return button;
  }

  createText(text) {
    const cardText = document.createElement("div");
    cardText.classList.add("card-text");
    cardText.innerText = text;
    return cardText;
  }
}
