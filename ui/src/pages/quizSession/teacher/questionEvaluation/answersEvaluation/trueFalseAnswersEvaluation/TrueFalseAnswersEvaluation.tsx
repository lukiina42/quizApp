import React from "react";
import { TextField, Grid, InputAdornment, Tooltip } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import { QuestionEvaluationType } from "../../../types";
import { tooltipClasses } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";

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

//Custom styling of the answer text fields
const useStyles = makeStyles(() => ({
  answer: {
    width: "100%",
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

const AdornmentCustom = ({ isCorrect }: { isCorrect: boolean }) => {
  return (
    <InputAdornment position="end">
      {isCorrect ? (
        <Check
          color="secondary"
          onMouseEnter={(event) =>
            (event.currentTarget.style.cursor = "pointer")
          }
          onMouseLeave={(event) =>
            (event.currentTarget.style.cursor = "default")
          }
        />
      ) : (
        <Clear
          color="error"
          onMouseEnter={(event) =>
            (event.currentTarget.style.cursor = "pointer")
          }
          onMouseLeave={(event) =>
            (event.currentTarget.style.cursor = "default")
          }
        />
      )}
    </InputAdornment>
  );
};

//Static props of all 4 text fields defined here to omit code repeating
const textFieldStaticProps = {
  multiline: true,
  rows: 3,
  size: "small" as any,
  variant: "outlined" as any,
};

interface TrueFalseAnswersProps {
  isCorrect: boolean;
  questionEvaluation?: QuestionEvaluationType;
  handleAnswerClick?: (answer: boolean) => void;
}

//Displays the answers in current question. The teacher can write into them when he is editting the question, but they are disabled
// and only displayed when teacher is presenting the quiz to students
const TrueFalseAnswersEvaluation = (props: TrueFalseAnswersProps) => {
  //Styling classes
  const classes = useStyles();

  const { questionEvaluation, isCorrect, handleAnswerClick } = props;

  const isEvaluation = handleAnswerClick ? false : true;

  const handleAnswerCurry = (answer: boolean) => {
    return handleAnswerClick ? (e) => handleAnswerClick(answer) : () => {};
  };

  return (
    <>
      <Grid
        container
        direction={"row"}
        spacing={isEvaluation ? 1 : 4}
        justifyContent="center"
        alignItems="center"
        //margin evens the spacing issues with grid
        sx={{ width: "100%", margin: "0 0 0 -8px" }}
      >
        <Grid item xs={6}>
          <TextField
            disabled={true}
            {...textFieldStaticProps}
            className={classes.answer}
            id={"true"}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            value={"\nTrue"}
            inputProps={{ style: { textAlign: "center" } }}
            sx={{
              backgroundColor: "#66A4FF",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            onClick={handleAnswerCurry(true)}
            InputProps={
              isEvaluation
                ? {
                    endAdornment: <AdornmentCustom isCorrect={isCorrect} />,
                  }
                : {}
            }
          />
          {isEvaluation && (
            <CustomTooltip>
              <div className={"answerScore"}>
                {isCorrect
                  ? questionEvaluation?.amountOfCorrectAnswers
                  : questionEvaluation!.amountOfAnswersTotal -
                    questionEvaluation!.amountOfCorrectAnswers}
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          )}
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={true}
            {...textFieldStaticProps}
            className={classes.answer}
            id={"false"}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            value={"\nFalse"}
            inputProps={{ style: { textAlign: "center" } }}
            onClick={handleAnswerCurry(false)}
            sx={{
              backgroundColor: "#f28f93",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            InputProps={
              isEvaluation
                ? {
                    endAdornment: <AdornmentCustom isCorrect={!isCorrect} />,
                  }
                : {}
            }
          />
          {isEvaluation && (
            <CustomTooltip>
              <div className={"answerScore"}>
                {isCorrect
                  ? questionEvaluation!.amountOfAnswersTotal -
                    questionEvaluation!.amountOfCorrectAnswers
                  : questionEvaluation?.amountOfCorrectAnswers}
                /{questionEvaluation?.amountOfAnswersTotal}
              </div>
            </CustomTooltip>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TrueFalseAnswersEvaluation;
