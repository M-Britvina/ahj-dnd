import { Placeholder } from "./Placeholder";

export default class DragAndDrop {
  constructor(container, callback) {
    this.container = container;
    this.placeholder = new Placeholder();
    this.callback = callback;
    this.draggedCard = null;
    this.dragOffset = { x: 0, y: 0 };
    this.originalDimensions = { width: 0, height: 0 };

    this.container.addEventListener("mousedown", this.onMouseDown);
  }

  onMouseDown = (event) => {
    if (
      !event.target.closest(".card") ||
      event.target.classList.contains("delete-card-btn")
    ) {
      return;
    }

    event.preventDefault();

    const card = event.target.closest(".card");
    this.draggedCard = card;

    card.classList.add("dragged");
    document.body.style.cursor = "grabbing";

    this.originalDimensions = {
      width: card.offsetWidth,
      height: card.offsetHeight,
    };

    const cardRect = card.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - cardRect.left,
      y: event.clientY - cardRect.top,
    };
    this.container.addEventListener("mouseup", this.onMouseUp);
    this.container.addEventListener("mousemove", this.onMouseMove);
  };

  onMouseMove = (event) => {
    if (!this.draggedCard) return;

    const card = this.draggedCard;
    this.placeholder.show(
      card.closest(".card-list"),
      this.originalDimensions.height,
      card.nextSibling,
    );
    card.style.position = "absolute";
    card.style.width = `${this.originalDimensions.width}px`;
    card.style.left = `${event.clientX - this.dragOffset.x}px`;
    card.style.top = `${event.clientY - this.dragOffset.y}px`;

    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const column = elements.find((el) => el.classList.contains("column"));

    if (column) {
      const cardsList = column.querySelector(".card-list");
      const cards = Array.from(cardsList.children).filter(
        (child) => child !== card && child !== this.placeholder.element,
      );

      const closestCard = this.findClosestCard(cards, event.clientY);

      if (closestCard) {
        const cardRect = closestCard.getBoundingClientRect();
        if (event.clientY < cardRect.top + cardRect.height / 2) {
          this.placeholder.insertBefore(closestCard);
        } else {
          this.placeholder.insertAfter(closestCard);
        }
      } else {
        this.placeholder.appendTo(cardsList);
      }
    }
  };

  onMouseUp = () => {
    if (!this.draggedCard) return;

    const card = this.draggedCard;
    if (this.placeholder.isVisible() && this.placeholder.element.parentNode) {
      this.placeholder.element.replaceWith(card);
    }
    card.style.position = "";
    card.style.left = "";
    card.style.top = "";
    card.style.width = "";
    document.body.style.cursor = "";
    card.classList.remove("dragged");

    this.placeholder.remove();
    this.draggedCard = null;

    if (this.callback) {
      this.callback();
    }

    document.removeEventListener("mousemove", this.onMousemove);
    document.removeEventListener("mouseup", this.onMouseup);
  };

  findClosestCard(cards, mouseY) {
    return cards.reduce(
      (closest, card) => {
        const rect = card.getBoundingClientRect();
        const offset = mouseY - rect.top - rect.height / 2;
        return offset < 0 && offset > closest.offset
          ? { offset, element: card }
          : closest;
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }
}
