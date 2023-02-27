import { Grid, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Editor from "./codeEditor/CustomCodeEditor";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import QuizAnswers from "./answers/QuizAnswers";
import TrueFalseAnswers from "./answers/TrueFalseAnswers";
import "react-toastify/dist/ReactToastify.css";
import {
  QuizQuestionAnswer,
  LanguageType,
  NewQuestionType,
} from "../../../common/types";
import { QuestionData } from "../types";

const useStyles = makeStyles((theme) => ({
  bottomButtons: {
    margin: theme.spacing(1),
    padding: "10px 0px 10px 0px",
    width: "160px",
  },
  textField: {
    //assuring that even when the text fields are disabled, the font color stays black
    "& .MuiInputBase-root": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "rgba(0, 0, 0, 1)",
      },
    },
  },
}));

interface QuestionCreatorProps {
  currentQuestionData: QuestionData;
  answers: QuizQuestionAnswer[];
  createNewQuizQuestion?: (key: number) => any; //TODO Question here
  handleAnswerValueChange?: (event) => void;
  handleAnswerCorrectChange: (key: string) => void;
  handleAnswerCorrectToggle: () => void;
  handleQuestionTextChange: (event) => void;
  handleQuestionTextChangeWithValue: (event) => void;
  handleLanguageChange: (event) => void;
  handleQuestionNameChange: (event) => void;
  handleSaveQuizButton: (event) => void;
  handleExitButton: () => void;
}

//Represents the right side of the page, where user sets parameters of the question
const QuestionCreator = (props: QuestionCreatorProps) => {
  const {
    currentQuestionData,
    answers,
    handleAnswerValueChange,
    handleAnswerCorrectChange,
    handleQuestionTextChange,
    handleQuestionTextChangeWithValue,
    handleQuestionNameChange,
    handleLanguageChange,
    handleSaveQuizButton,
    handleExitButton,
    handleAnswerCorrectToggle,
  } = props;

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
            id="name"
            size="small"
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            fullWidth
            value={currentQuestionData.questionName}
            onChange={handleQuestionNameChange}
            placeholder="Question name"
            className={classes.textField}
          />
        </Grid>
        <Grid
          item
          xs
          width={"80%"}
          sx={{
            minHeight:
              currentQuestionData.questionLanguage === LanguageType.PLAINTEXT
                ? "210px"
                : "326px",
          }}
        >
          <Grid container direction={"row"} spacing={0} sx={{ height: "100%" }}>
            <Grid item xs={10}>
              {currentQuestionData.questionLanguage ===
              LanguageType.PLAINTEXT ? (
                <TextField
                  id="theQuestion"
                  //@ts-ignore
                  size="big"
                  multiline
                  maxRows={8}
                  placeholder="Write your question here"
                  fullWidth
                  value={currentQuestionData.questionText}
                  onChange={handleQuestionTextChange}
                  className={classes.textField}
                />
              ) : (
                <Editor
                  language={
                    currentQuestionData.questionLanguage
                      ? currentQuestionData.questionLanguage
                      : LanguageType.C
                  }
                  value={
                    currentQuestionData.questionText
                      ? currentQuestionData.questionText
                      : ""
                  }
                  onChange={handleQuestionTextChangeWithValue}
                />
              )}
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                paddingLeft: "5px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Language
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={currentQuestionData.questionLanguage}
                  onChange={handleLanguageChange}
                >
                  <FormControlLabel
                    value={LanguageType.C}
                    control={<Radio size="small" />}
                    label="C"
                  />
                  <FormControlLabel
                    value={LanguageType.CPLUSPLUS}
                    control={<Radio size="small" />}
                    label="C++"
                  />
                  <FormControlLabel
                    value={LanguageType.JAVA}
                    control={<Radio size="small" />}
                    label="Java"
                  />
                  <FormControlLabel
                    value={LanguageType.PYTHON}
                    control={<Radio size="small" />}
                    label="Python"
                  />
                  <FormControlLabel
                    value={LanguageType.PLAINTEXT}
                    control={<Radio size="small" />}
                    label="Plain text"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          width={"80%"}
          sx={{ minHeight: "225px", display: "flex", alignItems: "center" }}
        >
          {currentQuestionData.questionType === NewQuestionType.QUIZ ? (
            <QuizAnswers
              quizAnswers={answers as QuizQuestionAnswer[]}
              handleAnswerValueChange={handleAnswerValueChange}
              handleAnswerCorrectChange={handleAnswerCorrectChange}
            />
          ) : (
            <TrueFalseAnswers
              handleAnswerClick={handleAnswerCorrectToggle}
              isCorrect={currentQuestionData.questionIsCorrect}
              showIcons={true}
            />
          )}
        </Grid>
        <Grid item sx={{ width: "100%", height: "10%" }}>
          <Grid
            container
            direction={"row"}
            spacing={0}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              height: "100%",
              width: "100%",
              minHeight: "70px",
              borderTop: 1,
            }}
          >
            <Button
              color="primary"
              variant="contained"
              sx={{ textTransform: "none" }}
              className={classes.bottomButtons}
              onClick={handleSaveQuizButton}
            >
              Save the quiz
            </Button>
            <Button
              color="info"
              variant="contained"
              sx={{ textTransform: "none" }}
              className={classes.bottomButtons}
              onClick={handleExitButton}
            >
              Exit without saving
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionCreator;
