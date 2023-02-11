import React, { useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@mui/material";
import SidePanel from "./sidePanel/SidePanel";
import QuestionCreator from "./questionParameters/QuestionCreate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LanguageType,
  QuizAnswers,
  ValidationStatus,
  UserInterface,
} from "../../common/types";
import { Quiz } from "../../common/types";
import { countBreakLines, createNewQuizQuestion } from "./helperMethods/index";
import { mergeSort } from "../helperMethods/index";
import { useUser } from "../../context/UserContext";

interface CurrentAndNextQuestion {
  key: number;
  type: string;
}

export enum CurrentOperationInQuestion {
  SAVE = "SAVE",
  DELETE = "DELETE",
}

export interface QuestionParams {
  currentOperation: CurrentOperationInQuestion;
  currentQuestion: CurrentAndNextQuestion;
  nextQuestion: CurrentAndNextQuestion;
}

export interface QuestionData {
  questionKey: number;
  questionName: string;
  questionText: string;
  questionLanguage: LanguageType;
  questionType: string;
}

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

//The parent component in which the user creates or edits the quiz. It has 2 child components: side panel
// where user can switch between the questions and questionCreator when user can set the parameters of the question
const CreateQuiz = (props) => {
  //User whose id is sent with the request to save the quiz
  const currentUser: UserInterface = useUser();

  //history used to move user to the home page, when he saves the quiz or exits
  const history = useHistory();

  //The quiz which comes from the home page (User either creates new quiz, in which
  //case only the name will be set or edits existing quiz)
  const quiz: Quiz = props.location.state ? props.location.state : null;

  let aggregatedQuiz: Quiz = useMemo(() => {
    let temporaryQuiz = quiz.questions
      ? quiz
      : { id: 0, name: quiz.name, questions: [createNewQuizQuestion(1)] };
    if (temporaryQuiz.questions) {
      let questions = mergeSort(temporaryQuiz.questions);
      return {
        ...temporaryQuiz,
        questions,
      };
    }
    return temporaryQuiz;
  }, [quiz]);

  //for initial and end state of the quiz (sent to BE)
  const currentQuizRef = useRef(aggregatedQuiz);

  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(aggregatedQuiz);

  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionData>({
    questionKey: currentQuizRef.current.questions[0].key,
    questionName: currentQuizRef.current.questions[0].name,
    questionText: currentQuizRef.current.questions[0].question.value,
    questionLanguage: currentQuizRef.current.questions[0].question.language,
    questionType: currentQuizRef.current.questions[0].questionType,
  });

  //Contains info about which answer values.
  //TODO add interface from types here
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    topLeftAnswer: currentQuizRef.current.questions[0].topLeftAnswer,
    topRightAnswer: currentQuizRef.current.questions[0].topRightAnswer,
    bottomLeftAnswer: currentQuizRef.current.questions[0].bottomLeftAnswer,
    bottomRightAnswer: currentQuizRef.current.questions[0].bottomRightAnswer,
  });

  const handleLanguageChange = (event) =>
    setCurrentQuestionData((prevQuestionData) => {
      return { ...prevQuestionData, questionLanguage: event.target.value };
    });

  const handleLanguageChangeWithValue = (value: LanguageType) =>
    setCurrentQuestionData((prevQuestionData) => {
      return { ...prevQuestionData, questionLanguage: value };
    });

  //Handles question text change
  const handleQuestionTextChange = (event): void =>
    setCurrentQuestionData((prevQuestionData) => {
      return { ...prevQuestionData, questionText: event.target.value };
    });

  //Handles question text change with value
  const handleQuestionTextChangeWithValue = (value: string) =>
    setCurrentQuestionData((prevQuestionData) => {
      return { ...prevQuestionData, questionText: value };
    });

  //Handles plain text question change
  const handleQuestionNameChange = (event) =>
    setCurrentQuestionData((prevQuestionData) => {
      return { ...prevQuestionData, questionName: event.target.value };
    });

  const handleAnswerCorrectChange = (key: string) => {
    setQuizAnswers((prevQuizAnswers) => {
      return {
        ...prevQuizAnswers,
        [key]: {
          ...[key],
          value: prevQuizAnswers[key].value,
          isCorrect: !prevQuizAnswers[key].isCorrect,
        },
      };
    });
  };

  //Handles change in one of the answers, handles the input
  const handleAnswerValueChange = (event): void => {
    if (
      event.target.value.length > 150 ||
      countBreakLines(event.target.value) > 2
    ) {
      return;
    }
    setQuizAnswers((currAnswers) => {
      return {
        ...currAnswers,
        [event.target.id]: {
          ...currAnswers[event.target.id],
          value: event.target.value,
        },
      };
    });
  };

  //validates current question
  //TODOOOOOOOOO QUESTIONEDITREFACTOR
  function validate(): ValidationStatus {
    let emptyAnswerValues = 0;
    if (!currentQuestionData.questionName) {
      return ValidationStatus.NAMEOFQUESTION;
    }
    //count empty answers
    Object.entries(quizAnswers).forEach(([, answer]) => {
      if (answer.value === "") {
        emptyAnswerValues += 1;
      }
    });

    if (emptyAnswerValues > 2) {
      return ValidationStatus.TWOANSWERS;
    }
    return ValidationStatus.OK;
  }

  //Saves the question with the current values -> states or values of text fields are used
  const saveTheQuestion = (finalSave: boolean): void => {
    const updatedQuestion =
      //currentQuestionData.questionType === NewQuestionType.QUIZ //TODO add Question type here to newQuestion
      {
        key: currentQuestionData.questionKey,
        questionType: currentQuestionData.questionType,
        name: currentQuestionData.questionName,
        question: {
          answerType: "QUIZ" as "QUIZ",
          value: currentQuestionData.questionText,
          language: currentQuestionData.questionLanguage,
        },
        topLeftAnswer: {
          answerType: "QUIZ" as "QUIZ",
          value: quizAnswers.topLeftAnswer.value,
          isCorrect: quizAnswers.topLeftAnswer.isCorrect,
        },
        topRightAnswer: {
          answerType: "QUIZ" as "QUIZ",
          value: quizAnswers.topRightAnswer.value,
          isCorrect: quizAnswers.topRightAnswer.isCorrect,
        },
        bottomLeftAnswer: {
          answerType: "QUIZ" as "QUIZ",
          value: quizAnswers.bottomLeftAnswer.value,
          isCorrect: quizAnswers.bottomLeftAnswer.isCorrect,
        },
        bottomRightAnswer: {
          answerType: "QUIZ" as "QUIZ",
          value: quizAnswers.bottomRightAnswer.value,
          isCorrect: quizAnswers.bottomRightAnswer.isCorrect,
        },
      };
    const updatedQuestionsFromQuiz = [...currentQuiz.questions];
    updatedQuestionsFromQuiz[currentQuestionData.questionKey - 1] =
      updatedQuestion;

    if (!finalSave) {
      //update questions in quiz without mutating the state
      setCurrentQuiz((prevQuiz) => {
        return {
          ...prevQuiz,
          questions: updatedQuestionsFromQuiz,
        };
      });
    } else {
      currentQuizRef.current = {
        ...currentQuizRef.current,
        questions: updatedQuestionsFromQuiz,
      };
    }
  };

  const handleChangeQuestion = (key: number) => {
    if (key + 1 === currentQuestionData.questionKey) {
      //don't do anything if current question is clicked
      return;
    }
    const status = validate();
    if (status !== "OK") {
      toast.warn(status, {
        ...toastSettings,
      });
      return;
    }

    saveTheQuestion(false);

    const newQuestion = currentQuiz.questions[key];

    setCurrentQuestionData((prevCurrentQuestionData) => {
      return {
        ...prevCurrentQuestionData,
        questionKey: newQuestion.key,
        questionName: newQuestion.name,
        questionText: newQuestion.question.value,
        questionLanguage: newQuestion.question.language,
        questionType: newQuestion.questionType,
      };
    });
    setQuizAnswers((prevQuizAnswers) => {
      return {
        ...prevQuizAnswers,
        topLeftAnswer: newQuestion.topLeftAnswer,
        bottomLeftAnswer: newQuestion.bottomLeftAnswer,
        topRightAnswer: newQuestion.topRightAnswer,
        bottomRightAnswer: newQuestion.bottomRightAnswer,
      };
    });
  };

  //defines what should happen if user creates new question => create new empty question and
  //save the current one in QuestionCreator.js using the questionParams state
  const handleNewQuestionClick = (event): void => {
    const status = validate();
    if (status !== "OK") {
      toast.warn(status, {
        ...toastSettings,
      });
      return;
    }
    saveTheQuestion(false);

    const newQuestion = createNewQuizQuestion(currentQuiz.questions.length + 1);
    setCurrentQuiz((prevQuiz) => {
      return {
        ...prevQuiz,
        questions: [...prevQuiz.questions, newQuestion],
      };
    });

    setCurrentQuestionData((prevCurrentQuestionData) => {
      return {
        ...prevCurrentQuestionData,
        questionKey: newQuestion.key,
        questionName: newQuestion.name,
        questionText: newQuestion.question.value,
        questionLanguage: newQuestion.question.language,
        questionType: newQuestion.questionType,
      };
    });
    setQuizAnswers((prevQuizAnswers) => {
      return {
        ...prevQuizAnswers,
        topLeftAnswer: newQuestion.topLeftAnswer,
        bottomLeftAnswer: newQuestion.bottomLeftAnswer,
        topRightAnswer: newQuestion.topRightAnswer,
        bottomRightAnswer: newQuestion.bottomRightAnswer,
      };
    });
  };

  //Gets triggered when user clicks on the trash icon in the question, the question then gets deleted
  const handleDeleteQuestion = (key: number): void => {
    //user wants to delete current question and only one question is in the quiz:
    //notify user that there has to be at least one question in the quiz
    if (currentQuiz.questions.length === 1) {
      toast.warn("There has to be at least one question in the quiz", {
        ...toastSettings,
      });
      return;
    }
    //delete question from the question list - need the updated list immediately
    //so if I did this in the setState which is asynchronous I would get old data below
    const updatedQuestions = [...currentQuiz.questions];
    updatedQuestions.splice(key - 1, 1);
    for (let i = key - 1; i < updatedQuestions.length; i++) {
      //Edit the keys of remaining questions
      //If there are questions 1, 2 and 3 and user deletes 2,
      //we don't want question 1 and question 3 remain on the page
      let question = updatedQuestions[i];
      question.key = i + 1;
      updatedQuestions[i] = question;
    }
    //update the state
    setCurrentQuiz((prevQuiz) => {
      return {
        ...prevQuiz,
        questions: updatedQuestions,
      };
    });

    //user wants to delete current question and there are more questions in the quiz
    if (currentQuestionData.questionKey === key) {
      const nextQuestion =
        key <= updatedQuestions.length
          ? updatedQuestions[key - 1]
          : updatedQuestions[key - 2];
      setCurrentQuestionData((prevCurrentQuestionData) => {
        return {
          ...prevCurrentQuestionData,
          questionKey: nextQuestion.key,
          questionName: nextQuestion.name,
          questionText: nextQuestion.question.value,
          questionLanguage: nextQuestion.question.language,
          questionType: nextQuestion.questionType,
        };
      });
      setQuizAnswers((prevQuizAnswers) => {
        return {
          ...prevQuizAnswers,
          topLeftAnswer: nextQuestion.topLeftAnswer,
          bottomLeftAnswer: nextQuestion.bottomLeftAnswer,
          topRightAnswer: nextQuestion.topRightAnswer,
          bottomRightAnswer: nextQuestion.bottomRightAnswer,
        };
      });
    } else if (currentQuestionData.questionKey > key) {
      setCurrentQuestionData((prevData) => {
        return {
          ...prevData,
          questionKey: prevData.questionKey - 1,
        };
      });
    }
  };

  //Saves the whole quiz
  const handleSaveQuizButton = (event): void => {
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
    const bodyToSave = {
      ...currentQuiz,
      id: currentQuiz.id === 0 ? null : currentQuiz.id,
      questions: currentQuizRef.current.questions,
    };
    console.log("body sent to be", bodyToSave);
    debugger;
    fetch(
      process.env.REACT_APP_FETCH_HOST + "/betterKahoot/quiz/" + currentUser.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSave), // body data type must match "Content-Type" header
      }
    )
      .then((response) => {
        if (response.status === 201) {
          history.push("/");
        } else {
          throw new Error(response.status.toString());
        }
      })
      .catch((error) => console.log(error));
  };

  //Handles exit button, moves user to the home page
  const handleExitButton = (): void => {
    history.push("/");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid
        container
        direction="row"
        spacing={0}
        justifyContent="flex-start"
        //Header has 45px
        sx={{ height: "calc(100vh - 45px)", minHeight: 0 }}
      >
        <Grid
          item
          xs={3}
          md={2}
          lg={2}
          xl={1}
          sx={{
            // this enables vertical scroll on sidebar only
            minHeight: 0,
            display: "flex",
            maxHeight: "100%",
          }}
        >
          <SidePanel
            validate={validate}
            currentQuiz={currentQuiz}
            createNewQuizQuestion={createNewQuizQuestion}
            currentQuestionData={currentQuestionData}
            changeQuestion={handleChangeQuestion}
            handleNewQuestion={handleNewQuestionClick}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        </Grid>
        <Grid item xs={9} md={10} lg={10} xl={11}>
          <QuestionCreator
            currentQuestionData={currentQuestionData}
            quizAnswers={quizAnswers}
            handleAnswerValueChange={handleAnswerValueChange}
            handleAnswerCorrectChange={handleAnswerCorrectChange}
            handleQuestionTextChange={handleQuestionTextChange}
            handleQuestionTextChangeWithValue={
              handleQuestionTextChangeWithValue
            }
            handleQuestionNameChange={handleQuestionNameChange}
            handleLanguageChange={handleLanguageChange}
            handleLanguageChangeWithValue={handleLanguageChangeWithValue}
            handleSaveQuizButton={handleSaveQuizButton}
            handleExitButton={handleExitButton}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CreateQuiz;
