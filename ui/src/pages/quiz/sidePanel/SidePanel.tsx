import React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Popover from "@mui/material/Popover";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { NewQuestionType, Quiz, ValidationStatus } from "../../../common/types";
import { QuestionData } from "../CreateQuiz";

interface SidePanelProps {
  createNewQuizQuestion: (key: number) => any; //TODO should be Question
  validate: () => ValidationStatus;
  currentQuiz: Quiz;
  currentQuestionData: QuestionData;
  changeQuestion: (key: number) => void;
  handleNewQuestion: (event) => void;
  handleDeleteQuestion: (key: number) => void;
}

//Represents the panel on the left, which contains the questions currently created in the quiz
const SidePanel = (props: SidePanelProps) => {
  const {
    currentQuiz,
    handleDeleteQuestion,
    currentQuestionData,
    changeQuestion,
    handleNewQuestion,
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

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={0}
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
          <Grid item key={question.key}>
            <Grid
              container
              direction="row"
              alignItems={"center"}
              sx={{
                backgroundColor: "#D0CDF5",
                padding: "7px 5.5px 7px 5.5px",
                margin: "20px 0 20px 0",
                border: "2px solid #B2ADFD",
                borderRadius: "4px",
              }}
            >
              <Box
                component={"div"}
                id={question.key.toString()}
                onClick={handleQuestionClick}
                onMouseEnter={(event) =>
                  (event.currentTarget.style.cursor = "pointer")
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.cursor = "default")
                }
                style={{ height: "100%" }}
              >
                {currentQuestionData.questionKey === question.key ? (
                  <Typography sx={{ fontWeight: "bold" }}>
                    Question {question.key}
                  </Typography>
                ) : (
                  <Typography sx={{ fontWeight: "500" }}>
                    Question {question.key}
                  </Typography>
                )}
              </Box>
              <DeleteIcon
                color="info"
                onClick={() => handleDeleteQuestion(question.key)}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = "#B2ADFD";
                  event.currentTarget.style.color = "black";
                  event.currentTarget.style.cursor = "pointer";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = "inherit";
                  event.currentTarget.style.color = "#64748B";
                  event.currentTarget.style.cursor = "default";
                }}
                sx={{ borderRadius: "5px" }}
              />
            </Grid>
          </Grid>
        ))}
        <Grid item>
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
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Grid
          container
          alignItems="center"
          spacing={1}
          justifyContent="flex-start"
          sx={{ padding: 2, width: 230 }}
        >
          <Grid item xs={12}>
            <Button
              id={NewQuestionType.QUIZ}
              color="primary"
              variant="contained"
              sx={{ textTransform: "none", width: "100%" }}
              onClick={(e) => {
                handlePopoverClose();
                handleNewQuestion(e);
              }}
            >
              Quiz question
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              id={NewQuestionType.TRUEFALSE}
              color="primary"
              variant="contained"
              sx={{ textTransform: "none", width: "100%" }}
              onClick={handleNewQuestion}
              disabled
            >
              True/false question
            </Button>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};

export default SidePanel;
