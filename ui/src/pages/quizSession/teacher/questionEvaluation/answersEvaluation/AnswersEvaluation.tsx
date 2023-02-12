import React from "react";

import { QuestionEvaluationType } from "../../types";
import { Question } from "../../../../../common/types";

import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { TextField, Grid, InputAdornment, Tooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";

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
            {currentQuestion[id as keyof QuestionAnswer].isCorrect ? (
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
        <Grid item xs={6}>
          <Grid container direction={"row"}>
            <TextField
              {...textFieldStaticProps}
              className={classes.answer}
              value={currentQuestion?.topLeftAnswer.value}
              inputProps={{ style: { textAlign: "center" } }}
              sx={{ backgroundColor: "#66A4FF", flexGrow: 1 }}
              InputProps={{
                endAdornment: <AdornmentCustom id="topLeftAnswer" />,
              }}
            />
            <CustomTooltip>
              <div className={"answerScore"}>
                {
                  questionEvaluation?.amountsOfPositiveAnswersToEachAnswer
                    .TOPLEFT
                }
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction={"row"}>
            <TextField
              {...textFieldStaticProps}
              className={classes.answer}
              //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
              value={currentQuestion?.topRightAnswer.value}
              inputProps={{ style: { textAlign: "center" } }}
              sx={{ backgroundColor: "#B456EB", flexGrow: 1 }}
              InputProps={{
                endAdornment: <AdornmentCustom id="topRightAnswer" />,
              }}
            />
            <CustomTooltip>
              <div className={"answerScore"}>
                {
                  questionEvaluation?.amountsOfPositiveAnswersToEachAnswer
                    .TOPRIGHT
                }
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction={"row"}>
            <TextField
              {...textFieldStaticProps}
              className={classes.answer}
              value={currentQuestion?.bottomLeftAnswer.value}
              inputProps={{ style: { textAlign: "center" } }}
              sx={{ backgroundColor: "#EB9B56", flexGrow: 1 }}
              InputProps={{
                endAdornment: <AdornmentCustom id="bottomLeftAnswer" />,
              }}
            />
            <CustomTooltip>
              <div className={"answerScore"}>
                {
                  questionEvaluation?.amountsOfPositiveAnswersToEachAnswer
                    .BOTTOMLEFT
                }
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container direction={"row"}>
            <TextField
              {...textFieldStaticProps}
              className={classes.answer}
              value={currentQuestion?.bottomRightAnswer.value}
              inputProps={{ style: { textAlign: "center" } }}
              sx={{ backgroundColor: "#FFFF99", flexGrow: 1 }}
              InputProps={{
                endAdornment: <AdornmentCustom id="bottomRightAnswer" />,
              }}
            />
            <CustomTooltip>
              <div className={"answerScore"}>
                {
                  questionEvaluation?.amountsOfPositiveAnswersToEachAnswer
                    .BOTTOMRIGHT
                }
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AnswersEvaluation;
