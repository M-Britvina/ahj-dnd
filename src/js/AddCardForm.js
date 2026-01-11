export default class AddCardForm {
  constructor() {}

  addCardForm(element) {
    const column = element.closest(".column");
    if (column.querySelector(".add-card-form")) {
      return;
    }
    element.insertAdjacentHTML("beforebegin", this.createForm());
    column.querySelector(".card-input").focus();
  }

  closeCardForm(element) {
    element.closest(".add-card-form").remove();
  }

  createForm() {
    return `
      <form class="add-card-form">
        <input class="card-input" type="text" placeholder="Enter a text for new card" required>
        <div>
          <button type="submit" class="create-card-btn">Add Card</button>
          <button type="button" class="close-add-form-btn">🞩</button>
        </div>
      </form>
    `;
  }
}
