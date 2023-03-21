import React from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "react-toastify/dist/ReactToastify.css";
import {
  LanguageType,
  Question,
  NewQuestionType,
} from "../../../../common/types";
import QuizAnswers from "../../../quiz/questionParameters/answers/QuizAnswers";
import Editor from "../../../quiz/questionParameters/codeEditor/CustomCodeEditor";
import TrueFalseAnswers from "../../../quiz/questionParameters/answers/TrueFalseAnswers";
import { StudentAnsweredResponse } from "../types";

const useStyles = makeStyles((theme) => ({
  textField: {
    //assuring that even when the text fields are disabled, the font color stays black
    "& .MuiInputBase-root": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "rgba(0, 0, 0, 1)",
      },
    },
  },
}));

interface QuestionDisplayProps {
  currentQuestion: Question;
  handleEndQuestionButton: () => void;
  studentsAnsweredInfo?: StudentAnsweredResponse;
  usersLength: number;
}

//Represents the right side of the page, where user sets parameters of the question
const QuestionDisplay = (props: QuestionDisplayProps) => {
  const {
    currentQuestion,
    handleEndQuestionButton,
    studentsAnsweredInfo,
    usersLength,
  } = props;

  //need to set the value of name text field in the question if the is not updating the quiz (which means he is presenting it)
  const nameDynamicValue = { value: currentQuestion.name };

  //Styling classes
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        alignItems={"center"}
        direction="column"
        justifyContent={"flex-start"}
        flexWrap="nowrap"
        sx={{
          height: "calc(100vh - 3.5rem)",
          minHeight: "680px",
          width: "100%",
        }}
      >
        <Grid item xs={11} sx={{ width: "100%", minHeight: "630px" }}>
          <Grid
            container
            direction={"column"}
            alignItems="center"
            justifyContent={"center"}
            flexWrap="nowrap"
            sx={{ width: "100%", height: "100%" }}
          >
            <Grid item xs={11} sx={{ width: "100%" }}>
              <Grid
                container
                direction="column"
                spacing={0}
                justifyContent="flex-start"
                alignItems={"center"}
                sx={{ height: "100%" }}
              >
                {/* using % rather than xs here, because no decimals are allowed with xs.. */}
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    minHeight: "58px",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80%",
                  }}
                >
                  <TextField
                    {...nameDynamicValue}
                    id="name"
                    size="small"
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    fullWidth
                    placeholder="Question name"
                    className={classes.textField}
                    disabled
                  />
                </Grid>
                <Grid item xs width={"80%"} sx={{ maxHeight: "340px" }}>
                  <Grid
                    container
                    direction={"row"}
                    spacing={0}
                    sx={{ height: "100%" }}
                  >
                    <Grid item xs={12}>
                      {currentQuestion.question.language ===
                      LanguageType.PLAINTEXT ? (
                        <TextField
                          id="theQuestion"
                          //@ts-ignore
                          size="big"
                          multiline
                          maxRows={8}
                          placeholder="Write your question here"
                          fullWidth
                          value={currentQuestion.question.value}
                          className={classes.textField}
                          disabled
                        />
                      ) : (
                        <Editor
                          language={currentQuestion.question.language}
                          value={currentQuestion.question.value}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={4}
                  width={"80%"}
                  sx={{
                    minHeight: "225px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {currentQuestion.questionType === NewQuestionType.QUIZ ? (
                    <QuizAnswers
                      quizAnswers={currentQuestion.answers}
                      disabled
                      handleAnswerCorrectChange={() => {}}
                    />
                  ) : (
                    <TrueFalseAnswers showIcons={false} />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Typography fontWeight={"bold"} fontSize={"20px"}>
                Answers:&nbsp;
                {studentsAnsweredInfo
                  ? studentsAnsweredInfo.amountOfAnswers
                  : 0}{" "}
                /&nbsp;
                {studentsAnsweredInfo?.amountOfStudents
                  ? studentsAnsweredInfo.amountOfStudents
                  : usersLength}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs
          sx={{ minHeight: "50px", width: "100%", textAlign: "center" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleEndQuestionButton}
          >
            End the question
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionDisplay;
