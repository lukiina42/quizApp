import React from "react";
import { Grid, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "react-toastify/dist/ReactToastify.css";
import { LanguageType, QuizAnswers } from "../../../../common/types";
import Answers from "../../../quiz/questionParameters/answers/Answers";
import Editor from "../../../quiz/questionParameters/codeEditor/CustomCodeEditor";

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
  quizAnswers: QuizAnswers;
  questionName?: string;
  codeTextProp?: string;
  languageProp?: LanguageType;
}

//Represents the right side of the page, where user sets parameters of the question
const QuestionDisplay = (props: QuestionDisplayProps) => {
  const { quizAnswers, questionName, codeTextProp, languageProp } = props;

  //need to set the value of name text field in the question if the is not updating the quiz (which means he is presenting it)
  const nameDynamicValue = { value: questionName };

  //Styling classes
  const classes = useStyles();

  return (
    <>
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
          <Grid container direction={"row"} spacing={0} sx={{ height: "100%" }}>
            <Grid item xs={12}>
              {languageProp === LanguageType.PLAINTEXT ? (
                <TextField
                  id="theQuestion"
                  //@ts-ignore
                  size="big"
                  multiline
                  maxRows={8}
                  placeholder="Write your question here"
                  fullWidth
                  value={codeTextProp}
                  className={classes.textField}
                  disabled
                />
              ) : (
                <Editor language={languageProp!} value={codeTextProp!} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          width={"80%"}
          sx={{ minHeight: "225px", display: "flex", alignItems: "center" }}
        >
          <Answers
            quizAnswers={quizAnswers}
            disabled
            handleAnswerCorrectChange={() => {}}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionDisplay;
