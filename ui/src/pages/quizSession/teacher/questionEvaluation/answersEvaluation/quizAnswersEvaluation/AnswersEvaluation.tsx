import React from "react";

import { QuestionEvaluationType } from "../../../types";
import { Question } from "../../../../../../common/types";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { TextField, Grid, InputAdornment, Tooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { getBackgroundColor } from "../../../../../quiz/questionParameters/answers/QuizAnswers";
import { QuizQuestionPosition } from "../../../../../../common/types";

interface AnswersEvaluationProps {
  currentQuestion: Question | null;
  questionEvaluation: QuestionEvaluationType | null;
}

interface QuestionAnswer {
  value: string;
  isCorrect: boolean;
}

const useStyles = makeStyles(() => ({
  answer: {
    borderRadius: "4px",
    //assuring that even when the text fields are disabled, the font color stays black
    "& .MuiInputBase-root": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "rgba(0, 0, 0, 1)",
        cursor: "pointer",
      },
    },
  },
}));

//Custom styling of the tooltip, which gets displayed, when user hoovers over thumbs up and down icons in the answers field
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip
    title={"Submitted / Total"}
    placement="top"
    arrow
    {...props}
    classes={{ popper: className }}
  />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 160,
    padding: 10,
    textAlign: "center",
    backgroundColor: "#373737",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#373737",
  },
});

interface props {
  multiline: boolean;
  maxRows: number;
  size: "medium" | "small";
  disabled: boolean;
}

const textFieldStaticProps: props = {
  multiline: true,
  maxRows: 3,
  size: "small",
  disabled: true,
};

interface AdornmentProps {
  id: string;
}

//Displays the answers evaluation in the question. It displays the info about whether the answer should be correct and how many
//students thought that the answer was correct
const AnswersEvaluation = (props: AnswersEvaluationProps) => {
  const { questionEvaluation, currentQuestion } = props;
  const classes = useStyles();

  //Custom adornment of the tooltip, it is used 4 times for the answers, that's why it is extracted into the variable
  const AdornmentCustom = (props: AdornmentProps) => {
    const { id } = props;
    if (currentQuestion) {
      return (
        <>
          <InputAdornment position="end">
            {currentQuestion.answers.find((answer) => answer.position === id)
              ?.isCorrect ? (
              <ThumbUpIcon color="secondary" />
            ) : (
              <ThumbDownIcon color="error" />
            )}
          </InputAdornment>
        </>
      );
    }
    return <></>;
  };

  const getEvaluationNumber = (
    position,
    quizEvaluation: QuestionEvaluationType
  ) => {
    switch (position) {
      case QuizQuestionPosition.TOPLEFT:
        return quizEvaluation.amountsOfPositiveAnswersToEachAnswer.TOPLEFT;
      case QuizQuestionPosition.TOPRIGHT:
        return quizEvaluation.amountsOfPositiveAnswersToEachAnswer.TOPRIGHT;
      case QuizQuestionPosition.BOTTOMLEFT:
        return quizEvaluation.amountsOfPositiveAnswersToEachAnswer.BOTTOMLEFT;
      case QuizQuestionPosition.BOTTOMRIGHT:
        return quizEvaluation.amountsOfPositiveAnswersToEachAnswer.BOTTOMRIGHT;
      default:
        throw new Error("Unknown position " + position);
    }
  };

  return (
    <>
      <Grid
        container
        direction={"row"}
        spacing={1}
        justifyContent="center"
        alignItems="center"
        //margin evens the spacing issues with grid
        sx={{ width: "100%", margin: "0 0 0 -4px" }}
      >
        {currentQuestion?.answers.map((answer) => {
          return (
            <Grid item xs={6} key={answer.position}>
              <Grid container direction={"row"}>
                <TextField
                  {...textFieldStaticProps}
                  className={classes.answer}
                  value={answer.value}
                  inputProps={{ style: { textAlign: "center" } }}
                  sx={{
                    backgroundColor: getBackgroundColor(answer.position),
                    flexGrow: 1,
                  }}
                  InputProps={{
                    endAdornment: <AdornmentCustom id={answer.position} />,
                  }}
                />
                <CustomTooltip>
                  <div className={"answerScore"}>
                    {getEvaluationNumber(answer.position, questionEvaluation!)}/
                    {questionEvaluation?.amountOfAnswersTotal}
                  </div>
                </CustomTooltip>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default AnswersEvaluation;
