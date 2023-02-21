import { TextField, Grid, InputAdornment } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Check, Clear } from "@mui/icons-material";

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
  handleAnswerCorrectToggle: () => void;
  disabled?: boolean;
  allowCorrectSwitch?: boolean;
  isCorrect: boolean;
}

//Displays the answers in current question. The teacher can write into them when he is editting the question, but they are disabled
// and only displayed when teacher is presenting the quiz to students
const TrueFalseAnswers = (props: TrueFalseAnswersProps) => {
  //Styling classes
  const classes = useStyles();

  const { handleAnswerCorrectToggle, disabled, allowCorrectSwitch, isCorrect } =
    props;

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
            disabled={true}
            {...textFieldStaticProps}
            className={classes.answer}
            id={"true"}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            onClick={handleAnswerCorrectToggle}
            value={"\nTrue"}
            inputProps={{ style: { textAlign: "center" } }}
            sx={{
              backgroundColor: "#66A4FF",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            InputProps={{
              endAdornment: <AdornmentCustom isCorrect={isCorrect} />,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={true}
            {...textFieldStaticProps}
            className={classes.answer}
            id={"false"}
            //if the user is answering to the question in the session, he should be able to toggle answerCorrect when he clicks on the whole text field
            onClick={handleAnswerCorrectToggle}
            value={"\nFalse"}
            inputProps={{ style: { textAlign: "center" } }}
            sx={{
              backgroundColor: "#f28f93",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            InputProps={{
              endAdornment: <AdornmentCustom isCorrect={!isCorrect} />,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TrueFalseAnswers;
