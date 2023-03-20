import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import "react-toastify/dist/ReactToastify.css";
import { Question, Quiz } from "../../../common/types";
import { QuestionData } from "../types/index";
import "./sidePanel.css";
import SidePanelItem from "./sidePanelItem/SidePanelItem";
import NewQuestionPopover from "./NewQuestionPopover/NewQuestionPopover";

interface SidePanelProps {
  currentQuiz: Quiz;
  currentQuestionData: QuestionData;
  changeQuestion: (key: number) => void;
  handleNewQuestion: (event) => void;
  handleDeleteQuestion: (key: number) => void;
  changeOrderingOfQuestions: (
    draggedElementKey: number,
    nextElementKey: number
  ) => void;
}

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

//Represents the panel on the left, which contains the questions currently created in the quiz
const SidePanel = (props: SidePanelProps) => {
  const {
    currentQuiz,
    handleDeleteQuestion,
    currentQuestionData,
    changeQuestion,
    handleNewQuestion,
    changeOrderingOfQuestions,
  } = props;
  //questions displayed in the panel
  const currentQuestions = currentQuiz.questions;

  //state used to define where the popover, which contains the new question type options, should get displayed (around which tag)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  //derived states
  //open says whether the popover is displayed or not
  let open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //handles popover which displays which type of new question the user wants to create
  const handlePopoverChange = (
    event: React.MouseEvent<SVGSVGElement>
  ): void => {
    open = !open;
    if (open) {
      setAnchorEl(event.currentTarget as any);
    } else {
      setAnchorEl(null);
    }
  };

  //close the popover
  const handlePopoverClose = (): void => setAnchorEl(null);

  //defines what happens if user clicks on other already existing question, change questionParams state, which triggers
  //the save operation of current question in QuestionCreator.js
  const handleQuestionClick = (event): void => {
    const key = event.currentTarget.id - 1;
    changeQuestion(key);
  };

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
  }, [currentQuestions, changeOrderingOfQuestions]);

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={0}
        className="dragContainer"
        justifyContent="flex-start"
        sx={{
          backgroundColor: "#E0DFF0",
          marginTop: 0,
          flex: "1 1 auto",
          overflow: "auto",
          maxHeight: "100%",
          flexWrap: "nowrap",
        }}
      >
        {/* Map all the current questions into the side panel */}
        {currentQuestions.map((question) => (
          <SidePanelItem
            key={question.key}
            question={question}
            currentQuestionData={currentQuestionData}
            handleQuestionClick={handleQuestionClick}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
        <Grid item id="addQuestion">
          <AddBoxRoundedIcon
            component={"svg"}
            color="info"
            onMouseEnter={(event) =>
              (event.currentTarget.style.cursor = "pointer")
            }
            onMouseLeave={(event) =>
              (event.currentTarget.style.cursor = "default")
            }
            onClick={handlePopoverChange}
          />
        </Grid>
      </Grid>
      {/* The popover for which the state is used. It's open operation is trigerred by clicking on + button in the side panel */}
      <NewQuestionPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
        handleNewQuestion={handleNewQuestion}
      />
    </>
  );
};

export default SidePanel;
