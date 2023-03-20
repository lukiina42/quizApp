import { useEffect } from "react";
import { Question } from "../../../../common/types";

const div = document.createElement("div");
div.classList.add("dividerDiv");
div.id = "divider";

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const handleDragOver = (
  e: DragEvent,
  container: Element,
  currentQuestions: Question[],
  addQuestionIcon: HTMLElement
) => {
  e.preventDefault();
  const draggable = document.querySelector(".dragging");
  if (!draggable) return;
  const afterElement = getDragAfterElement(container, e.clientY);
  //if after element exists (we are not dragging to the end), check if the drag indicator should be displayed
  if (afterElement) {
    if (parseInt(draggable.id) === parseInt(afterElement.id) - 1) {
      if (container.contains(div)) {
        container.removeChild(div);
      }
      return;
    }
  }
  //if we are dragging to the end, check if drag indicator should be displayed
  if (afterElement == null) {
    if (parseInt(draggable.id) !== currentQuestions.length) {
      container.insertBefore(div, addQuestionIcon);
    } else {
      if (container.contains(div)) container.removeChild(div);
    }
  } else {
    //insert the indicator
    for (let i = 0; i < container.childNodes?.length; i++) {
      const node = container.childNodes[i];
      if (node === afterElement) {
        const beforeElement = container?.childNodes[i - 1] as HTMLElement;
        if (!beforeElement) {
          container.insertBefore(div, afterElement);
        } else {
          if (beforeElement!.id !== "divider")
            container.insertBefore(div, afterElement);
        }
      }
    }
  }
};

export default function useDragQuestion(
  changeOrderingOfQuestions,
  currentQuestions: Question[]
) {
  //TODO useEffectEvent wrap the changeOrderingOfQuestions here when the

  useEffect(() => {
    const draggables = document.querySelectorAll(".draggable");
    const container = document.querySelector(".dragContainer");
    if (!container) return;
    const addQuestionIcon = document.getElementById("addQuestion");

    const handleDragEnd = (e) => {
      const draggable = document.querySelector(".dragging");
      if (!draggable) return;
      const afterElement = getDragAfterElement(container, e.clientY);
      changeOrderingOfQuestions(
        parseInt(draggable?.id),
        parseInt(afterElement ? afterElement.id : 0)
      );
      //remove the indicator if it is displayed
      if (container!.contains(div)) {
        container!.removeChild(div);
      }
      draggable.classList.remove("dragging");
    };

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
      });
      draggable.addEventListener("dragend", handleDragEnd);
    });

    const handleDragOverHandler = (e: Event) =>
      handleDragOver(
        e as DragEvent,
        container,
        currentQuestions,
        addQuestionIcon as HTMLElement
      );

    container.addEventListener("dragover", handleDragOverHandler);

    return () => {
      draggables.forEach((draggable) => {
        //draggable.removeEventListener("dragstart");
        draggable.removeEventListener("dragend", handleDragEnd);
      });
      container.removeEventListener("dragover", handleDragOverHandler);
    };
    //Could use stringified currentQuestions here, but for now I am ok with losing a bit of performance with effect running on every render
  }, [currentQuestions, changeOrderingOfQuestions]);
}
