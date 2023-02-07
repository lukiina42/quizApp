import React, { useState } from "react";
import { Grid } from "@mui/material";
import SidePanel from "./sidePanel/SidePanel";
import QuestionCreator from "./questionParameters/QuestionCreate";
import { ToastContainer } from "react-toastify";
import { NewQuestionType, LanguageType, AnswerValues, AnswersCorrect, ValidationStatus } from "../../common/types";
import { Quiz, Question } from "../../common/types";

interface CurrentAndNextQuestion {
  key: number,
  type: string
}

export enum CurrentOperationInQuestion {
  SAVE = "SAVE",
  DELETE = "DELETE",
}

export interface QuestionParams {
  currentOperation: CurrentOperationInQuestion,
  currentQuestion: CurrentAndNextQuestion,
  nextQuestion: CurrentAndNextQuestion
}

//The parent component in which the user creates or edits the quiz. It has 2 child components: side panel
// where user can switch between the questions and questionCreator when user can set the parameters of the question
const CreateQuiz = (props) => {
  //The quiz which comes from the home page (User either creates new quiz, in which
  //case only the name will be set or edits existing quiz)
  const quiz: Quiz = props.location.state ? props.location.state : null;

  //TODO rename type to questionType. Not all answers are then displayed in a new question
  //Creates new question with empty values
  const createNewQuizQuestion = (key: number) => {
    return {
      key: key,
      type: NewQuestionType.QUIZ,
      name: "",
      question: {
        value: "",
        language: LanguageType.C,
      },
      topLeftAnswer: {
        value: "",
        isCorrect: false,
      },
      topRightAnswer: {
        value: "",
        isCorrect: false,
      },
      bottomLeftAnswer: {
        value: "",
        isCorrect: false,
      },
      bottomRightAnswer: {
        value: "",
        isCorrect: false,
      },
    };
  };

  //Helper method for merge sort, merges 2 arrays
  function merge(left: Question[], right: Question[]): Question[] {
    let sortedArr: Question[] = []; // the sorted elements will go here

    while (left.length && right.length) {
      // insert the smallest element to the sortedArr
      if (left[0].key < right[0].key) {
        //Considering the condition zero index of the arrays cannot be undefined so this ts error can be ignored
        //@ts-ignore: Type 'undefined' is not assignable to type 'never'
        sortedArr.push(left.shift());
      } else {
        //@ts-ignore: Type 'undefined' is not assignable to type 'never'
        sortedArr.push(right.shift());
      }
    }

    // use spread operator and create a new array, combining the three arrays
    return [...sortedArr, ...left, ...right];
  }

  //Merge sort to sort the questions in quiz
  function mergeSort(arr: Question[]): Question[] {
    const half: number = arr.length / 2;

    // the base case is array length <=1
    if (arr.length <= 1) {
      return arr;
    }

    const left = arr.splice(0, half); // the first half of the array
    const right = arr;
    return merge(mergeSort(left), mergeSort(right));
  }

  //Contains info about which answers are correct and which are false. This info is saved to each question.
  const [answersCorrect, setAnswersCorrect] = useState<AnswersCorrect>({
    TopLeft: false,
    TopRight: false,
    BottomRight: false,
    BottomLeft: false,
  });

  //Contains info about which answer values.
  //TODO add interface from types here
  const [answersValues, setAnswersValues] = useState<AnswerValues>({
    topLeftAnswer: "",
    topRightAnswer: "",
    bottomLeftAnswer: "",
    bottomRightAnswer: "",
  });

  //validates current question
  function validate(): ValidationStatus {
    let emptyAnswerValues = 0;
    const nameElement = document.getElementById("name") as HTMLInputElement | null
    if (nameElement !== null && nameElement.value  === "") {
      return ValidationStatus.NAMEOFQUESTION;
    }
    Object.entries(answersValues).forEach(([, value]) => {
      if (value === "") {
        emptyAnswerValues += 1;
      }
    });

    if (emptyAnswerValues > 2) {
      return ValidationStatus.TWOANSWERS;
    }
    return ValidationStatus.OK;
  }

  //Counts amount of enters in the text, used in answer text field
  function countBreakLines(text: string): number {
    let breakLines = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        breakLines++;
      }
    }
    return breakLines;
  }

  //Handles change in one of the answers, handles the input
  const handleAnswerValueChange = (event): void => {
    if (
      event.target.value.length > 150 ||
      countBreakLines(event.target.value) > 2
    ) {
      return;
    }
    setAnswersValues((currAnswersValues) => {
      return { ...currAnswersValues, [event.target.id]: event.target.value };
    });
  };

  //TODO
  //Created questions in the quiz
  //Is initialized with one empty question shown to the user when he opens the page
  //@ts-ignore
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>(() => {
    let quizToReturn = quiz.questions
      ? quiz
      : { id: 0, name: quiz.name, questions: [createNewQuizQuestion(1)] };
    if (quizToReturn.questions) {
      //@ts-ignore
      let questions = mergeSort(quizToReturn.questions);
      quizToReturn.questions = questions;
    }
    return quizToReturn;
  });

  //State to define current question displayed in the quiz window.
  //When the current question should be saved, nextQuestion is updated, which triggers save action in QuestionCreator.js
  const [questionParams, setQuestionParams] = useState<QuestionParams>({
    currentOperation: CurrentOperationInQuestion.SAVE,
    currentQuestion: {
      key: 1,
      type: NewQuestionType.QUIZ,
    },
    nextQuestion: {
      key: 1,
      type: NewQuestionType.QUIZ,
    },
  });

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
            setCurrentQuiz={setCurrentQuiz}
            setQuestionParams={setQuestionParams}
            questionParams={questionParams}
            createNewQuizQuestion={createNewQuizQuestion}
          />
        </Grid>
        <Grid item xs={9} md={10} lg={10} xl={11}>
          <QuestionCreator
            validate={validate}
            answersCorrect={answersCorrect}
            setAnswersCorrect={setAnswersCorrect}
            answersValues={answersValues}
            handleAnswerValueChange={handleAnswerValueChange}
            setAnswersValues={setAnswersValues}
            setCurrentQuiz={setCurrentQuiz}
            currentQuiz={currentQuiz}
            setQuestionParams={setQuestionParams}
            questionParams={questionParams}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CreateQuiz;
