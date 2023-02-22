import React, { useReducer, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid } from "@mui/material";
import SidePanel from "./sidePanel/SidePanel";
import QuestionCreator from "./questionParameters/QuestionCreate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LanguageType,
  NewQuestionType,
  Question,
  QuizQuestionAnswer,
  UserInterface,
} from "../../common/types";
import { Quiz } from "../../common/types";
import {
  countBreakLines,
  createNewQuestion,
  createQuestionFromStates,
  toastSettings,
  validateQuestionInput,
} from "./helperMethods/index";
import { useUser } from "../../context/UserContext";
import { QuestionData } from "./types/index";
import { saveQuiz } from "../../api/quizApi";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import questionDataReducer, {
  actionTypes,
} from "./questionDataReducer/questionDataReducer";

//The parent component in which the user creates or edits the quiz. It has 2 child components: side panel
// where user can switch between the questions and questionCreator when user can set the parameters of the question
const CreateQuiz = (props) => {
  //User whose id is sent with the request to save the quiz
  const currentUser: UserInterface = useUser();

  //history used to move user to the home page, when he saves the quiz or exits
  const history = useHistory();

  //get quiz from redux because I can
  const { quiz } = useSelector((state) => state) as { quiz: Quiz };

  //for initial and end state of the quiz (sent to BE)
  const currentQuizRef = useRef(quiz);

  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(quiz);

  const [currentQuestionData, dispatchQuestionData] = useReducer(
    questionDataReducer,
    {
      questionKey: quiz.questions[0].key,
      questionName: quiz.questions[0].name,
      questionText: quiz.questions[0].question.value,
      questionLanguage: quiz.questions[0].question.language,
      questionType: quiz.questions[0].questionType,
      questionIsCorrect: quiz.questions[0].isCorrect
        ? quiz.questions[0].isCorrect
        : false,
    }
  );

  //Contains info about which answer values.
  const [answers, setAnswers] = useState<QuizQuestionAnswer[]>(
    quiz.questions[0].answers
  );

  const saveQuizMutation = useMutation(saveQuiz, {
    onSuccess: () => {
      history.push("/");
    },
  });

  const handleLanguageChange = (event) => {
    dispatchQuestionData({
      type: actionTypes.LANGUAGECHANGE,
      language: event.target.value,
    });
  };

  //Handles question text change
  const handleQuestionTextChange = (event): void => {
    dispatchQuestionData({
      action: actionTypes.QUESTIONTEXTCHANGE,
      text: event.target.value,
    });
  };

  //Handles question text change with value
  const handleQuestionTextChangeWithValue = (value: string) => {
    dispatchQuestionData({
      action: actionTypes.QUESTIONTEXTCHANGE,
      text: value,
    });
  };

  //Handles plain text question change
  const handleQuestionNameChange = (event) => {
    dispatchQuestionData({
      action: actionTypes.QUESTIONNAMECHANGE,
      questionName: event.target.value,
    });
  };

  const handleQuizAnswerCorrectChange = (key: string) => {
    setAnswers(
      answers.map((answer) => {
        if (answer.position === key) {
          return {
            ...answer,
            isCorrect: !answer.isCorrect,
          };
        }
        return answer;
      })
    );
  };

  const handleTrueFalseAnswerCorrectToggle = () => {
    dispatchQuestionData({ action: actionTypes.ISCORRECTTOGGLE });
  };

  //Handles change in one of the answers, handles the input
  const handleQuizAnswerValueChange = (event): void => {
    if (
      event.target.value.length > 150 ||
      countBreakLines(event.target.value) > 2
    ) {
      return;
    }
    setAnswers(
      (answers as QuizQuestionAnswer[]).map((answer) => {
        if (answer.position === event.target.id) {
          return {
            ...answer,
            value: event.target.value,
          };
        }
        return answer;
      })
    );
  };

  //Saves the question with the current values -> states or values of text fields are used
  const saveTheQuestion = (finalSave: boolean): void => {
    const updatedQuestion = createQuestionFromStates(
      currentQuestionData,
      answers
    );
    const updatedQuestionsFromQuiz = [...currentQuiz.questions];
    updatedQuestionsFromQuiz[currentQuestionData.questionKey - 1] =
      updatedQuestion as Question;

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
    const status = validateQuestionInput(currentQuestionData, answers);
    if (status !== "OK") {
      toast.warn(status, {
        ...toastSettings,
      });
      return;
    }

    saveTheQuestion(false);

    const newQuestion = currentQuiz.questions[key];

    dispatchQuestionData({ action: actionTypes.LOADNEXTQUESTION, newQuestion });

    switch (newQuestion.questionType) {
      case NewQuestionType.QUIZ:
        setAnswers(newQuestion.answers);
        break;
      case NewQuestionType.TRUEFALSE:
        setAnswers([]);
        break;
      default:
        setAnswers([]);
        break;
    }
  };

  //defines what should happen if user creates new question => create new empty question and
  //save the current one in QuestionCreator.js using the questionParams state
  const handleNewQuestionClick = (questionType: NewQuestionType): void => {
    if (currentQuestionData.questionType === NewQuestionType.QUIZ) {
      const status = validateQuestionInput(currentQuestionData, answers);
      if (status !== "OK") {
        toast.warn(status, {
          ...toastSettings,
        });
        return;
      }
      saveTheQuestion(false);

      const newQuestion = createNewQuestion(
        currentQuiz.questions.length + 1,
        questionType
      );
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
      setAnswers(newQuestion.answers);
    } else if (currentQuestionData.questionType === NewQuestionType.TRUEFALSE) {
      saveTheQuestion(false);

      const newQuestion = createNewQuestion(
        currentQuiz.questions.length + 1,
        questionType
      );
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
          questionIsCorrect: true,
        };
      });
      setAnswers(newQuestion.answers);
    }
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
      setAnswers(nextQuestion.answers);
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
    const status = validateQuestionInput(currentQuestionData, answers);
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

    saveQuizMutation.mutate({
      bodyToSave,
      userId: currentUser.id,
    });
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
        //Header has 3.5rem
        sx={{ height: "calc(100vh - 3.5rem)", minHeight: 0 }}
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
            currentQuiz={currentQuiz}
            currentQuestionData={currentQuestionData}
            changeQuestion={handleChangeQuestion}
            handleNewQuestion={handleNewQuestionClick}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        </Grid>
        <Grid item xs={9} md={10} lg={10} xl={11}>
          <QuestionCreator
            currentQuestionData={currentQuestionData}
            answers={answers}
            handleAnswerValueChange={handleQuizAnswerValueChange}
            handleAnswerCorrectChange={handleQuizAnswerCorrectChange}
            handleAnswerCorrectToggle={handleTrueFalseAnswerCorrectToggle}
            handleQuestionTextChange={handleQuestionTextChange}
            handleQuestionTextChangeWithValue={
              handleQuestionTextChangeWithValue
            }
            handleQuestionNameChange={handleQuestionNameChange}
            handleLanguageChange={handleLanguageChange}
            handleSaveQuizButton={handleSaveQuizButton}
            handleExitButton={handleExitButton}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CreateQuiz;
