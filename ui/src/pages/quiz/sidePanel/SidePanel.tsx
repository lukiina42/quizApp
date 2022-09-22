import React, { Dispatch, SetStateAction } from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Popover from "@mui/material/Popover";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { NewQuestionType, Quiz, ValidationStatus } from "../../../common/types";
import { CurrentOperationInQuestion, QuestionParams } from "../CreateQuiz";

interface SidePanelProps {
  setCurrentQuiz: Dispatch<SetStateAction<Quiz>>,
  setQuestionParams: Dispatch<SetStateAction<QuestionParams>>,
  createNewQuizQuestion: (key: number) => any, //TODO should be Question
  validate: () => ValidationStatus,
  questionParams: QuestionParams,
  currentQuiz: Quiz,
}

//Represents the panel on the left, which contains the questions currently created in the quiz
const SidePanel = (props: SidePanelProps) => {
  const {
    setCurrentQuiz,
    setQuestionParams,
    questionParams,
    createNewQuizQuestion,
    currentQuiz,
    validate
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
  const handlePopoverChange = (event: React.MouseEvent<SVGSVGElement>): void => {
    open = !open;
    if (open) {
      setAnchorEl(event.currentTarget as any);
    } else {
      setAnchorEl(null);
    }
  };

  //close the popover
  const handlePopoverClose = (): void => setAnchorEl(null);

  //default settings of the notifications, stored in const to prevent code repeating, using spred operator instead
  const toastSettings = {
    position: "top-right" as const,
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  //defines what should happen if user creates new question => create new empty question and
  //save the current one in QuestionCreator.js using the questionParams state
  const handleNewQuestionClick = (event): void => {
    const status = validate();
    if (status !== "OK") {
      toast.warn(status, {
        ...toastSettings,
      });
    } else {
      handlePopoverClose();
      const newQuestion =
        event.target.id === NewQuestionType.QUIZ
          ? createNewQuizQuestion(
              currentQuestions[currentQuestions.length - 1].key + 1
            )
          : {
              key: currentQuestions[currentQuestions.length - 1].key + 1,
              type: NewQuestionType.TRUEFALSE,
              question: "",
              true: "",
              false: "",
            };
      setCurrentQuiz((currentQuestions) => {
        return {
          ...currentQuestions,
          questions: [...currentQuestions.questions, newQuestion],
        };
      });
      setQuestionParams((currQuestionParams) => {
        return {
          ...currQuestionParams,
          nextQuestion: newQuestion,
          currentOperation: CurrentOperationInQuestion.SAVE,
        };
      });
    }
  };

  //defines what happens if user clicks on other already existing question, change questionParams state, which triggers
  //the save operation of current question in QuestionCreator.js
  const handleQuestionClick = (event): void => {
    const status = validate();
    if (
      questionParams.currentQuestion.key !== parseInt(event.currentTarget.id)
    ) {
      if (status !== "OK") {
        toast.warn(status, {
          ...toastSettings,
        });
        return;
      }
      //TODO rename type to questionType in createNewQuizQuestion
      //@ts-ignore
      setQuestionParams((currQuestionParams) => {
        return {
          ...currQuestionParams,
          nextQuestion: currentQuestions[event.currentTarget.id - 1],
          currentOperation: CurrentOperationInQuestion.SAVE,
        };
      });
    }
  };

  //Gets triggered when user clicks on the trash icon in the question, the question then gets deleted
  const handleDeleteQuestionIcon = (key: number): void => {
    //user wants to delete current question and only one question is in the quiz:
    //notify user that there has to be at least one question in the quiz
    if (currentQuestions.length === 1) {
      toast.warn("There has to be at least one question in the quiz", {
        ...toastSettings,
      });
      return;
    }
    //delete the question from the list
    setCurrentQuiz((currQuiz) => {
      const quiz = { ...currQuiz };
      const questions = [...quiz.questions];
      questions.splice(key - 1, 1);
      for (let i = key - 1; i < questions.length; i++) {
        //Edit the keys of remaining questions
        //If there are questions 1, 2 and 3 and user deletes 2,
        //we don't want question 1 and question 3 remain on the page
        let question = questions[i];
        question.key = i + 1;
        questions[i] = question;
      }
      quiz.questions = questions;
      return quiz;
    });
    //user wants to delete current question and there are more questions in the quiz
    if (questionParams.currentQuestion.key === key) {
      //TODO rename type to questionType in createNewQuizQuestion
      //@ts-ignore
      setQuestionParams((currQuestionParams) => {
        return {
          ...currQuestionParams,
          nextQuestion:
            key < currentQuestions.length
              ? currentQuestions[key]
              : currentQuestions[key - 2],
          currentOperation: CurrentOperationInQuestion.DELETE,
        };
      });
    }
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
                {questionParams.currentQuestion.key === question.key ? (
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
                onClick={() => handleDeleteQuestionIcon(question.key)}
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
              onClick={handleNewQuestionClick}
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
              onClick={handleNewQuestionClick}
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
