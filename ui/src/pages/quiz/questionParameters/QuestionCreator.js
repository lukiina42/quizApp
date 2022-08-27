import React, { useEffect, useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Editor from "./codeEditor/CustomCodeEditor";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Answers from "./answers/Answers";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newQuestionTypes, languageTypes } from "../../../common/types";
import { useUser } from "../../../context/UserContext";

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

//Represents the right side of the page, where user sets parameters of the question
const QuestionCreator = (props) => {
  const {
    setCurrentQuestions,
    questionParams,
    setQuestionParams,
    answersCorrect,
    setAnswersCorrect,
    answersValues,
    setAnswersValues,
    handleAnswerValueChange,
    validate,
    disabled,
    questionName,
    codeTextProp,
    languageProp,
  } = props;
  const currentQuestions = !disabled ? props.currentQuestions.questions : null;

  //User whose id is sent with the request to save the quiz
  const currentUser = useUser();

  //this is going to be sent to API on save the quiz button click
  let finalQuestions = [];

  //need to set the value of name text field in the question if the is not updating the quiz (which means he is presenting it)
  const nameDynamicValue = disabled ? { value: questionName } : {};

  //Handles the code text or the plain text, depends on current language
  const [codeText, setCodeText] = useState(disabled ? codeTextProp : "");

  //Holds current language in which user types the question
  const [language, setLanguage] = useState(
    disabled ? languageProp : languageTypes.C
  );

  //history used to move user to the home page, when he saves the quiz or exits
  const history = useHistory();

  const handleLanguageChange = (event) => setLanguage(event.target.value);

  //Handles plain text question change
  const handleQuestionPlainTextChange = (event) =>
    setCodeText(event.target.value);

  //Saves the question with the current values -> states or values of text fields are used
  const saveTheQuestion = (finalSave) => {
    const newQuestion =
      questionParams.currentQuestion.type === newQuestionTypes.QUIZ
        ? {
            key: questionParams.currentQuestion.key,
            type: questionParams.currentQuestion.type,
            name: document.getElementById("name").value,
            question: {
              value: codeText,
              language: language,
            },
            topLeftAnswer: {
              value: answersValues.topLeftAnswer,
              isCorrect: answersCorrect.TopLeft,
            },
            topRightAnswer: {
              value: answersValues.topRightAnswer,
              isCorrect: answersCorrect.TopRight,
            },
            bottomLeftAnswer: {
              value: answersValues.bottomLeftAnswer,
              isCorrect: answersCorrect.BottomLeft,
            },
            bottomRightAnswer: {
              value: answersValues.bottomRightAnswer,
              isCorrect: answersCorrect.BottomRight,
            },
          }
        : {
            // TODO true/false question
            // key: questionParams.currentQuestion.key,
            // type: questionParams.currentQuestion.type,
            // question: document.getElementById('theQuestion').value,
            // true: document.getElementById('TopLeft').value,
            // false: document.getElementById('TopRight').value,
          };
    if (finalSave) {
      //finalQuestions variable is sent to the server to be saved
      finalQuestions = [...currentQuestions];
      finalQuestions[questionParams.currentQuestion.key - 1] = newQuestion;
    }
    setCurrentQuestions((currentQuestions) => {
      let questions = [...currentQuestions.questions];
      questions[questionParams.currentQuestion.key - 1] = newQuestion;
      return { ...currentQuestions, questions: questions };
    });
  };

  useEffect(() => {
    if (!disabled) {
      return;
    }
    setLanguage(languageProp);
    setCodeText(codeTextProp);
  }, [languageProp, codeTextProp, disabled]);

  //Executed only on first render. If disabled is true, it means that the question is not being editted,
  //only displayed, so we don't need to set the states
  useEffect(() => {
    //if teacher is presenting the quiz in front of students, this useEffect is not needed
    if (disabled) {
      return;
    }
    document.getElementById("name").value =
      currentQuestions[questionParams.nextQuestion.key - 1].name;
    setCodeText(currentQuestions[0].question.value);
    setLanguage(currentQuestions[0].question.language);
    setAnswersValues({
      topLeftAnswer: currentQuestions[0].topLeftAnswer.value,
      topRightAnswer: currentQuestions[0].topRightAnswer.value,
      bottomRightAnswer: currentQuestions[0].bottomRightAnswer.value,
      bottomLeftAnswer: currentQuestions[0].bottomLeftAnswer.value,
    });
    setAnswersCorrect({
      TopLeft: currentQuestions[0].topLeftAnswer.isCorrect,
      TopRight: currentQuestions[0].topRightAnswer.isCorrect,
      BottomRight: currentQuestions[0].bottomRightAnswer.isCorrect,
      BottomLeft: currentQuestions[0].bottomLeftAnswer.isCorrect,
    });
  }, []);

  //Observes the change of questionParams state. If the current and next question are different, the current question is saved
  //and then set to next question
  useEffect(() => {
    //don't want to save anything if teacher is presenting
    if (disabled) {
      return;
    }
    //If next and current question are different, it means that current question should be saved.
    //After the question is saved to the state currentQuestions, current question is set to next
    //question, which means no question should be saved.
    if (
      JSON.stringify(questionParams.currentQuestion) !==
      JSON.stringify(questionParams.nextQuestion)
    ) {
      if (questionParams.currentOperation === "SAVE") {
        saveTheQuestion(false);
      }
      document.getElementById("name").value =
        currentQuestions[questionParams.nextQuestion.key - 1].name;
      setCodeText(
        currentQuestions[questionParams.nextQuestion.key - 1].question.value
      );
      setLanguage(
        currentQuestions[questionParams.nextQuestion.key - 1].question.language
      );
      setAnswersValues({
        topLeftAnswer:
          currentQuestions[questionParams.nextQuestion.key - 1].topLeftAnswer
            .value,
        topRightAnswer:
          currentQuestions[questionParams.nextQuestion.key - 1].topRightAnswer
            .value,
        bottomRightAnswer:
          currentQuestions[questionParams.nextQuestion.key - 1]
            .bottomRightAnswer.value,
        bottomLeftAnswer:
          currentQuestions[questionParams.nextQuestion.key - 1].bottomLeftAnswer
            .value,
      });
      setAnswersCorrect({
        TopLeft:
          currentQuestions[questionParams.nextQuestion.key - 1].topLeftAnswer
            .isCorrect,
        TopRight:
          currentQuestions[questionParams.nextQuestion.key - 1].topRightAnswer
            .isCorrect,
        BottomRight:
          currentQuestions[questionParams.nextQuestion.key - 1]
            .bottomRightAnswer.isCorrect,
        BottomLeft:
          currentQuestions[questionParams.nextQuestion.key - 1].bottomLeftAnswer
            .isCorrect,
      });
      setQuestionParams((currQuestionParams) => {
        return {
          ...currQuestionParams,
          currentQuestion: currQuestionParams.nextQuestion,
        };
      });
    }
  }, [
    questionParams,
    //, answersCorrect, currentQuestionType, currentQuestions, newQuestionTypes, setCurrentQuestions, setSaveCurrQuestion
  ]);

  //Saves the whole quiz
  const handleSaveQuizButton = (event) => {
    event.preventDefault();
    const status = validate();
    if (status !== "OK") {
      toast.warn(status, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    saveTheQuestion(true);
    fetch("http://localhost:8080/betterKahoot/quiz/" + currentUser.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.currentQuestions.id ? props.currentQuestions.id : null,
        name: props.currentQuestions.name,
        questions: finalQuestions,
      }), // body data type must match "Content-Type" header
    })
      .then((response) => {
        if (response.status === 201) {
          history.push("/");
        } else {
          throw new Error(response.status);
        }
      })
      .catch((error) => console.log(error));
  };

  //Handles exit button, moves user to the home page
  const handleExitButton = () => {
    history.push("/");
  };

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
            disabled={disabled}
          />
        </Grid>
        <Grid
          item
          xs
          width={"80%"}
          sx={
            disabled
              ? { maxHeight: "340px" }
              : {
                  minHeight:
                    language === languageTypes.PLAINTEXT ? "210px" : "326px",
                }
          }
        >
          <Grid container direction={"row"} spacing={0} sx={{ height: "100%" }}>
            <Grid item xs={disabled ? 12 : 10}>
              {language === languageTypes.PLAINTEXT ? (
                <TextField
                  id="theQuestion"
                  size="big"
                  multiline
                  maxRows={8}
                  placeholder="Write your question here"
                  fullWidth
                  value={codeText}
                  onChange={
                    !disabled ? handleQuestionPlainTextChange : () => {}
                  }
                  className={classes.textField}
                  disabled={disabled}
                />
              ) : (
                <Editor
                  language={language}
                  value={codeText}
                  onChange={!disabled ? setCodeText : () => {}}
                  languageTypes={languageTypes}
                />
              )}
            </Grid>
            {!disabled && (
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
                    value={language}
                    onChange={handleLanguageChange}
                  >
                    <FormControlLabel
                      value={languageTypes.C}
                      control={<Radio size="small" />}
                      label="C"
                    />
                    <FormControlLabel
                      value={languageTypes.CPLUSPLUS}
                      control={<Radio size="small" />}
                      label="C++"
                    />
                    <FormControlLabel
                      value={languageTypes.JAVA}
                      control={<Radio size="small" />}
                      label="Java"
                    />
                    <FormControlLabel
                      value={languageTypes.PYTHON}
                      control={<Radio size="small" />}
                      label="Python"
                    />
                    <FormControlLabel
                      value={languageTypes.PLAINTEXT}
                      control={<Radio size="small" />}
                      label="Plain text"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          width={"80%"}
          sx={{ minHeight: "225px", display: "flex", alignItems: "center" }}
        >
          <Answers
            newQuestionTypes={newQuestionTypes}
            setAnswersCorrect={setAnswersCorrect}
            answersValues={answersValues}
            answersCorrect={answersCorrect}
            questionParams={questionParams}
            handleAnswerValueChange={handleAnswerValueChange}
            disabled={disabled}
          />
        </Grid>
        {!disabled && (
          <Grid item sx={{ width: "100%", height: "10%" }}>
            <Grid
              container
              direction="row"
              spacing={0}
              justifyContent="center"
              alignItems={"center"}
              sx={{
                height: "100%",
                witdth: "100%",
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
                color="neutral"
                variant="contained"
                sx={{ textTransform: "none" }}
                className={classes.bottomButtons}
                onClick={handleExitButton}
              >
                Exit without saving
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default QuestionCreator;
