import React from "react";
import { Grid } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import "react-toastify/dist/ReactToastify.css";
import { Quiz } from "../../../common/types";
import { QuestionData } from "../types/index";
import "./sidePanel.css";
import SidePanelItem from "./sidePanelItem/SidePanelItem";
import NewQuestionPopover from "./NewQuestionPopover/NewQuestionPopover";
import useDragQuestion from "./useDragQuestion/useDragQuestion";

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

  useDragQuestion(changeOrderingOfQuestions, currentQuestions);

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
