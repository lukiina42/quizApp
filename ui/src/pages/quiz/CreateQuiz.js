import { Grid } from '@mui/material'
import React, { useState } from 'react'
import SidePanel from './SidePanel'
import QuestionCreator from './QuestionCreator'
import { ToastContainer } from 'react-toastify';

const CreateQuiz = (props) => {
  const quiz = props.location.state ? props.location.state : null

  //defining enum like structure for question types
  const newQuestionTypes = {
    QUIZ: "QUIZ",
    TRUEFALSE: "TRUEFALSE",
  };

  //defining enum like structure for language types possible in question
  const languageTypes = {
    C: "text/x-csrc",
    CPLUSPLUS: "text/x-c++src",
    JAVA: "text/x-java",
    PYTHON: "text/x-python",
    PLAINTEXT: "PLAINTEXT"
  }

  const createNewQuizQuestion = (key) => {
    return {
      key: key,
      type: newQuestionTypes.QUIZ,
      name: "",
      question: {
        value: "",
        language: languageTypes.C
      },
      topLeftAnswer: {
        value: "",
        isCorrect: false
      },
      topRightAnswer: {
        value: "",
        isCorrect: false
      },
      bottomLeftAnswer: {
        value: "",
        isCorrect: false
      },
      bottomRightAnswer: {
        value: "",
        isCorrect: false
      }
    }
  }

  function merge(left, right) {
    let sortedArr = []; // the sorted elements will go here
  
    while (left.length && right.length) {
      // insert the smallest element to the sortedArr
      if (left[0].key < right[0].key) {
        sortedArr.push(left.shift());
      } else {
        sortedArr.push(right.shift());
      }
    }
  
    // use spread operator and create a new array, combining the three arrays
    return [...sortedArr, ...left, ...right];
  }

  function mergeSort(arr) {
    const half = arr.length / 2;
  
    // the base case is array length <=1
    if (arr.length <= 1) {
      return arr;
    }
  
    const left = arr.splice(0, half); // the first half of the array
    const right = arr;
    return merge(mergeSort(left), mergeSort(right));
  }

   //Contains info about which answers are correct and which are false. This info is saved to each question.
   const [answersCorrect, setAnswersCorrect] = useState({
    TopLeft: false,
    TopRight: false,
    BottomRight: false,
    BottomLeft: false
  })

  //Contains info about which answer values.
  const [answersValues, setAnswersValues] = useState({
    topLeftAnswer: "",
    topRightAnswer: "",
    bottomLeftAnswer: "",
    bottomRightAnswer: ""
  })

  //validates current question
  function validate(){
    let emptyAnswerValues = 0
    if(document.getElementById('name').value === ""){
      return "Name of the question is required"
    }
    for (const [key, value] of Object.entries(answersValues)) {
      if(value === ""){
        emptyAnswerValues += 1
      }
    }
    if(emptyAnswerValues > 2){
      return "At least 2 answers should be filled"
    }
    return "OK"
  }

  function countBreakLines(text){
    let breakLines = 0
    for(let i = 0; i < text.length; i++){
      if(text[i] === "\n"){
        breakLines++;
      }
    }
    return breakLines;
  }

  const handleAnswerValueChange = (event) => {
    if(event.target.value.length > 150 || countBreakLines(event.target.value) > 2){
      return;
    }
    setAnswersValues((currAnswersValues) => {
      return {...currAnswersValues, [event.target.id]: event.target.value}
    })
  }

  //Created questions in the quiz
  //Is initialized with one empty question shown to the user when he opens the page
  const [currentQuestions, setCurrentQuestions] = useState(() => {
    let quizToReturn = quiz.questions ? quiz : {name: quiz.name, questions: [createNewQuizQuestion(1)]}
    if(quizToReturn.questions){
      let questions = mergeSort(quizToReturn.questions)
      quizToReturn.questions = questions
    }
    return quizToReturn;
  }, []
  )

  //State to define current question displayed in the quiz window. 
  //When the current question should be saved, nextQuestion is updated, which triggers save action in QuestionCreator.js
  const [questionParams, setQuestionParams] = useState({
    currentQuestion: {
      key: 1,
      type: newQuestionTypes.QUIZ
    },
    nextQuestion: {
      key: 1,
      type: newQuestionTypes.QUIZ
    }
  })
  
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
      //Header has 38px
      sx = {{maxHeight:'calc(100vh - 38px)', height:'94vh'}}
    >
      <Grid item xs={3} md={2} lg={1}>
        <SidePanel 
          validate={validate}
          currentQuestions={currentQuestions}
          setCurrentQuestions={setCurrentQuestions}
          newQuestionTypes={newQuestionTypes}
          setQuestionParams={setQuestionParams}
          questionParams={questionParams}
          answersCorrect={answersCorrect}
          createNewQuizQuestion={createNewQuizQuestion}
          answersValues={answersValues}
        />
      </Grid>
      <Grid item xs={9} md={10} lg={11}>
        <QuestionCreator
          validate={validate}
          answersCorrect={answersCorrect}
          setAnswersCorrect={setAnswersCorrect}
          answersValues={answersValues}
          handleAnswerValueChange={handleAnswerValueChange}
          setAnswersValues={setAnswersValues}
          setCurrentQuestions={setCurrentQuestions}
          currentQuestions={currentQuestions}
          setQuestionParams={setQuestionParams}
          questionParams={questionParams}
          newQuestionTypes={newQuestionTypes}
          languageTypes={languageTypes}
        />
      </Grid>
    </Grid>
  </>
  )
}

export default CreateQuiz