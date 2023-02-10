import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { TextField, Grid, Tooltip, InputAdornment } from "@mui/material";
import { tooltipClasses } from "@mui/material";
import { styled, makeStyles } from "@mui/styles";
import { QuizAnswers } from "../../../../common/types";

//Custom styling of the tooltip, which gets displayed, when user hoovers over thumbs up and down icons in the answers field
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 160,
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

//Static props of all 4 text fields defined here to omit code repeating
const textFieldStaticProps = {
  multiline: true,
  maxRows: 3,
  size: "small" as any,
  variant: "outlined" as any,
};

interface AnswersProps {
  handleAnswerValueChange?: (event: any) => void;
  handleAnswerCorrectChange: (key: string) => void;
  disabled?: boolean;
  quizAnswers?: QuizAnswers;
}

//Displays the answers in current question. The teacher can write into them when he is editting the question, but they are disabled
// and only displayed when teacher is presenting the quiz to students
const Answers = (props: AnswersProps) => {
  //Styling classes
  const classes = useStyles();

  const {
    handleAnswerValueChange,
    handleAnswerCorrectChange,
    disabled,
    quizAnswers,
  } = props;

  //if disabled prop is true, it means we just want to show the answers to user in JoinQuiz.js
  //if disabled is false, the user is creating the quiz
  const textFieldChangingInputProps = disabled
    ? {
        disabled: true,
      }
    : {
        onChange: handleAnswerValueChange,
      };

  //Custom adornment of the tooltip, it is used 4 times for the answers, that's why it is extracted into the variable
  //It displays the thumbs up or down icons, which can be toggled when teacher is editting the question, and also it displays
  //the tooltip of the thumbs, which explains what they mean, when teacher hoovers over them
  const AdornmentCustom = (props) => {
    const { id } = props;
    return (
      <InputAdornment position="end">
        <CustomTooltip
          title={
            //@ts-ignore
            quizAnswers[id].isCorrect
              ? "Thumbs up: correct answer Click to toggle"
              : "Thumbs down: incorrect answer Click to toggle"
          }
          placement="top"
          arrow
        >
          {/* @ts-ignore */}
          {quizAnswers[id].isCorrect ? (
            <ThumbUpIcon
              color="secondary"
              onClick={() => handleAnswerCorrectChange(id)}
              onMouseEnter={(event) =>
                (event.currentTarget.style.cursor = "pointer")
              }
              onMouseLeave={(event) =>
                (event.currentTarget.style.cursor = "default")
              }
            />
          ) : (
            <ThumbDownIcon
              color="error"
              onClick={() => handleAnswerCorrectChange(id)}
              onMouseEnter={(event) =>
                (event.currentTarget.style.cursor = "pointer")
              }
              onMouseLeave={(event) =>
                (event.currentTarget.style.cursor = "default")
              }
            />
          )}
        </CustomTooltip>
      </InputAdornment>
    );
  };

  return (
    <>
      <Grid
        container
        direction={"row"}
        spacing={disabled ? 2 : 1}
        justifyContent="center"
        alignItems="center"
        //margin evens the spacing issues with grid
        sx={{ width: "100%", margin: disabled ? 0 : "0 0 0 -8px" }}
      >
        <Grid item xs={6}>
          <TextField
            {...textFieldChangingInputProps}
            {...textFieldStaticProps}
            className={classes.answer}
            id={"topLeftAnswer"}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            onClick={
              disabled
                ? () => handleAnswerCorrectChange("topLeftAnswer")
                : () => {}
            }
            value={quizAnswers?.topLeftAnswer.value}
            inputProps={{ style: { textAlign: "center" } }}
            sx={{ backgroundColor: "#66A4FF" }}
            InputProps={
              disabled && !quizAnswers
                ? {}
                : {
                    endAdornment: <AdornmentCustom id="topLeftAnswer" />,
                  }
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...textFieldChangingInputProps}
            {...textFieldStaticProps}
            id={"topRightAnswer"}
            className={classes.answer}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            onClick={
              disabled
                ? () => handleAnswerCorrectChange("topRightAnswer")
                : () => {}
            }
            value={quizAnswers?.topRightAnswer.value}
            inputProps={{ style: { textAlign: "center" } }}
            sx={{ backgroundColor: "#B456EB" }}
            InputProps={
              disabled && !quizAnswers
                ? {}
                : {
                    endAdornment: <AdornmentCustom id="topRightAnswer" />,
                  }
            }
          />
        </Grid>
        {true && (
          <>
            <Grid item xs={6}>
              <TextField
                {...textFieldChangingInputProps}
                {...textFieldStaticProps}
                id={"bottomLeftAnswer"}
                className={classes.answer}
                //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
                onClick={
                  disabled
                    ? () => handleAnswerCorrectChange("bottomLeftAnswer")
                    : () => {}
                }
                value={quizAnswers?.bottomLeftAnswer.value}
                inputProps={{ style: { textAlign: "center" } }}
                sx={{ backgroundColor: "#EB9B56" }}
                InputProps={
                  disabled && !quizAnswers
                    ? {}
                    : {
                        endAdornment: <AdornmentCustom id="bottomLeftAnswer" />,
                      }
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...textFieldChangingInputProps}
                {...textFieldStaticProps}
                id={"bottomRightAnswer"}
                className={classes.answer}
                //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
                onClick={
                  disabled
                    ? () => handleAnswerCorrectChange("bottomRightAnswer")
                    : () => {}
                }
                value={quizAnswers?.bottomRightAnswer.value}
                inputProps={{ style: { textAlign: "center" } }}
                sx={{ backgroundColor: "#FFFF99" }}
                InputProps={
                  disabled && !quizAnswers
                    ? {}
                    : {
                        endAdornment: (
                          <AdornmentCustom id="bottomRightAnswer" />
                        ),
                      }
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Answers;
