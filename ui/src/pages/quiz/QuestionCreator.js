import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import { makeStyles } from '@mui/styles';
import Editor from './CustomCodeEditor';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Answers from './Answers';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  bottomButtons: {
    margin: theme.spacing(1),
    padding: '10px 0px 10px 0px',
    width: '160px'
  }
}));

const QuestionCreator = (props) => {
  const {newQuestionTypes, setCurrentQuestions, questionParams, setQuestionParams, languageTypes, 
    answersCorrect, setAnswersCorrect, answersValues, setAnswersValues, handleAnswerValueChange, validate} = props
  const currentQuestions = props.currentQuestions.questions

  //this is be sent to API on save the quiz button click
  let finalQuestions = []

  //Handles the text question
  const [codeText, setCodeText] = useState("")

  //Holds current language in which user types the question
  const [language, setLanguage] = useState(languageTypes.C)

  const history = useHistory();

  const handleLanguageChange = (event) => setLanguage(event.target.value)

  const handleQuestionPlainTextChange = (event) => setCodeText(event.target.value)

  //Saves the question with the current values - states or values of text fields are used
  const saveTheQuestion = (finalSave) => {
    const newQuestion = questionParams.currentQuestion.type === newQuestionTypes.QUIZ ? {
      key: questionParams.currentQuestion.key,
      type: questionParams.currentQuestion.type,
      name: document.getElementById('name').value,
      question: {
        value: codeText,
        language: language
      },
      topLeftAnswer: {
        value: answersValues.topLeftAnswer,
        isCorrect: answersCorrect.TopLeft
      },
      topRightAnswer: {
        value: answersValues.topRightAnswer,
        isCorrect: answersCorrect.TopRight
      },
      bottomLeftAnswer: {
        value: answersValues.bottomLeftAnswer,
        isCorrect: answersCorrect.BottomLeft
      },
      bottomRightAnswer: {
        value: answersValues.bottomRightAnswer,
        isCorrect: answersCorrect.BottomRight
      }
    } : {
      // TODO true/false question
      // key: questionParams.currentQuestion.key,
      // type: questionParams.currentQuestion.type,
      // question: document.getElementById('theQuestion').value,
      // true: document.getElementById('TopLeft').value,
      // false: document.getElementById('TopRight').value,
    }
    if(finalSave){
      finalQuestions = [...currentQuestions]
      finalQuestions[questionParams.currentQuestion.key - 1] = newQuestion
      console.log(finalQuestions)
    }
    setCurrentQuestions((currentQuestions) => {
      let questions = [...currentQuestions.questions];
      questions[questionParams.currentQuestion.key - 1] = newQuestion
      return {...currentQuestions, questions: questions}
    })
  }

  useEffect(() => {
    document.getElementById('name').value = currentQuestions[questionParams.nextQuestion.key - 1].name
    setCodeText(currentQuestions[0].question.value)
    setLanguage(currentQuestions[0].question.language)
    setAnswersValues({
      topLeftAnswer: currentQuestions[0].topLeftAnswer.value,
      topRightAnswer:  currentQuestions[0].topRightAnswer.value,
      bottomRightAnswer: currentQuestions[0].bottomRightAnswer.value,
      bottomLeftAnswer: currentQuestions[0].bottomLeftAnswer.value
    })
    setAnswersCorrect({
      TopLeft: currentQuestions[0].topLeftAnswer.isCorrect,
      TopRight: currentQuestions[0].topRightAnswer.isCorrect,
      BottomRight: currentQuestions[0].bottomRightAnswer.isCorrect,
      BottomLeft: currentQuestions[0].bottomLeftAnswer.isCorrect
      })
  }, [])

  //Observes the change of questionParams state. If the current and next question are different, the current question is saved
  //and then set to next question
  useEffect(() => {
    //If next and current question are different, it means that current question should be saved.
    //After the question is saved to the state currentQuestions, current question is set to next
    //question, which means no question should be saved. 
    if(JSON.stringify(questionParams.currentQuestion) !== JSON.stringify(questionParams.nextQuestion)){
      saveTheQuestion(false);
      document.getElementById('name').value = currentQuestions[questionParams.nextQuestion.key - 1].name
      setCodeText(currentQuestions[questionParams.nextQuestion.key - 1].question.value)
      setLanguage(currentQuestions[questionParams.nextQuestion.key - 1].question.language)
      setAnswersValues({
        topLeftAnswer: currentQuestions[questionParams.nextQuestion.key - 1].topLeftAnswer.value,
        topRightAnswer:  currentQuestions[questionParams.nextQuestion.key - 1].topRightAnswer.value,
        bottomRightAnswer: currentQuestions[questionParams.nextQuestion.key - 1].bottomRightAnswer.value,
        bottomLeftAnswer: currentQuestions[questionParams.nextQuestion.key - 1].bottomLeftAnswer.value
      })
      setAnswersCorrect({
        TopLeft: currentQuestions[questionParams.nextQuestion.key - 1].topLeftAnswer.isCorrect,
        TopRight: currentQuestions[questionParams.nextQuestion.key - 1].topRightAnswer.isCorrect,
        BottomRight: currentQuestions[questionParams.nextQuestion.key - 1].bottomRightAnswer.isCorrect,
        BottomLeft: currentQuestions[questionParams.nextQuestion.key - 1].bottomLeftAnswer.isCorrect
      })
      setQuestionParams((currQuestionParams) => {
        return {...currQuestionParams, currentQuestion: currQuestionParams.nextQuestion}
      })
    }
  }
  , [questionParams
    //, answersCorrect, currentQuestionType, currentQuestions, newQuestionTypes, setCurrentQuestions, setSaveCurrQuestion
  ])

  //Saves the whole quiz
  const handleSaveQuizButton = (event) => {
    event.preventDefault()
    const status = validate()
    if(status !== "OK"){
      toast.warn(status, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return;
    }
    saveTheQuestion(true)
    fetch("http://localhost:8080/betterKahoot/quiz", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id: props.currentQuestions.id ?  props.currentQuestions.id : null , name: props.currentQuestions.name, questions: finalQuestions}), // body data type must match "Content-Type" header
    })
    .then(response => {
      if(response.status === 201){
        history.push('/home')
      }else{
        throw new Error(response.status)
      }
    })
    .catch(error => console.log(error));
  }

  const handleExitButton = () => {
    history.push('/home')
  }

  const classes = useStyles();

  return (
    <>
      <Grid
        container
        direction="column"
        spacing={0}
        justifyContent="flex-start"
        alignItems={"center"}
        sx = {{height: '100%'}}
      >
        {/* using % rather than xs here, because no decimals are allowed with xs.. */}
        <Grid item sx={{display: "flex", justifyContent: "center", alignItems: "center", width:'80%', height:'10%'}}>
          <TextField
            id="name"
            size="small"
            inputProps={{min: 0, style: { textAlign: 'center' }}}
            fullWidth
            placeholder="Question name"
          />
        </Grid>
        <Grid item xs width={'80%'}>
          <Grid
           container 
           direction={"row"}
           spacing={0}
           sx={{height: '100%'}}
          >
            <Grid item xs={10}>
              {language === languageTypes.PLAINTEXT ?
              <TextField
                id="theQuestion"
                size="big"
                multiline
                maxRows={8}
                inputProps={{min: 0, style: { textAlign: 'center' }}}
                placeholder="Write your question here"
                fullWidth
                value={codeText}
                onChange={handleQuestionPlainTextChange}
              />
              :
              <Editor 
                language = {language}
                value={codeText}
                onChange={setCodeText}
                languageTypes={languageTypes}
              />
              }
            </Grid>
            <Grid item xs={2} sx={{paddingLeft: '5px', display:'flex', justifyContent: 'center'}}>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Language</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <FormControlLabel value={languageTypes.C} control={<Radio size='small'/>} label="C" />
                  <FormControlLabel value={languageTypes.CPLUSPLUS} control={<Radio size='small'/>} label="C++" />
                  <FormControlLabel value={languageTypes.JAVA} control={<Radio size='small'/>} label="Java" />
                  <FormControlLabel value={languageTypes.PYTHON} control={<Radio size='small'/>} label="Python" />
                  <FormControlLabel value={languageTypes.PLAINTEXT} control={<Radio size='small'/>} label="Plain text" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4} width={'80%'} sx={{display:'flex', alignItems:'center'}}>
          <Answers
            newQuestionTypes={newQuestionTypes}
            setAnswersCorrect={setAnswersCorrect}
            answersValues={answersValues}
            answersCorrect={answersCorrect}
            questionParams={questionParams}
            handleAnswerValueChange={handleAnswerValueChange}
          >
          </Answers>
        </Grid>
        <Grid 
          item 
          sx={{width:'100%', height:'10%'}}
        >
          <Grid
            container
            direction="row"
            spacing={0}
            justifyContent="center"
            alignItems={"center"}
            sx = {{ height:'100%', borderTop: 1}}
          >
            <Button 
              color="primary" 
              variant="contained" 
              sx={{textTransform: 'none'}}
              className={classes.bottomButtons}
              onClick = {handleSaveQuizButton}
            >
              Save the quiz
            </Button>
            <Button 
              color="neutral" 
              variant="contained" 
              sx={{textTransform: 'none'}}
              className={classes.bottomButtons}
              onClick = {handleExitButton}
            >
              Exit without saving
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default QuestionCreator;