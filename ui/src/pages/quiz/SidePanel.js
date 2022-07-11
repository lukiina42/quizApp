import React from 'react'
import { Grid, Button, Typography, Box } from '@mui/material'
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Popover from '@mui/material/Popover';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SidePanel = (props) => {
  const {newQuestionTypes, setCurrentQuestions, setQuestionParams, questionParams, createNewQuizQuestion, validate} = props
  const currentQuestions = props.currentQuestions.questions

  //state used to define where the popover, which contains the new question type options, should get displayed (around which tag)
  const [anchorEl, setAnchorEl] = React.useState(null);

  //derived states
  //open says whether the popover is displayed or not
  let open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handlePopoverChange = (event) => {
    open = !open
    if(open){
      setAnchorEl(event.currentTarget);
    } else{
      setAnchorEl(null)
    }
  };

  const handlePopoverClose = () => setAnchorEl(null);

  //defines what should happen if user creates new question => create new empty question and
  //save the current one in QuestionCreator.js using the questionParams state
  const handleNewQuestionClick = (event) => {
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
    }else{
      handlePopoverClose()
      const newQuestion = event.target.id === newQuestionTypes.QUIZ ? 
        createNewQuizQuestion(currentQuestions[currentQuestions.length - 1].key + 1)
        : {
          key: currentQuestions[currentQuestions.length - 1].key + 1,
          type: newQuestionTypes.TRUEFALSE,
          question: "",
          true: "",
          false: "",
        }
      setCurrentQuestions((currentQuestions) => {
        return {...currentQuestions, questions: [...currentQuestions.questions, newQuestion]}
      })
      setQuestionParams((currQuestionParams) => {
        return {...currQuestionParams, nextQuestion: newQuestion}
      })
    }
  }

  //defines what happens if user clicks on other already existing question, change questionParams state, which triggers
  //the save operation of current question in QuestionCreator.js
  const handleQuestionClick = (event) => {
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
        });
    }else{
      if(questionParams.currentQuestion.key !== parseInt(event.currentTarget.id)){
        setQuestionParams((currQuestionParams) => {
          return {...currQuestionParams, nextQuestion: currentQuestions[event.currentTarget.id - 1]}
        })
      }
    }
  }

  return(
    <>
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={5}
      justifyContent="flex-start"
      sx={{backgroundColor: '#E0DFF0', height:'100%', marginTop: 0}}
    >
      {/* Map all the current questions into the side panel */}
      {currentQuestions.map((question) => 
        <Grid item key={question.key}>
          <Box 
            id={question.key} 
            onClick={handleQuestionClick} 
            onMouseEnter={event => event.currentTarget.style.cursor = "pointer"}
            onMouseLeave={event => event.currentTarget.style.cursor = "default"}
            style={{backgroundColor: "#D0CDF5", padding:'10px 5.5px 10px 5.5px', border: '2px solid #B2ADFD', borderRadius:'4px'}}
          >
            {questionParams.currentQuestion.key === question.key ?
            <Typography  sx={{fontWeight:"bold"}}>
              Question {question.key}
            </Typography> : 
            <Typography>
              Question {question.key}
            </Typography>
            }
          </Box>
        </Grid>
      )}
      <Grid item>
        <AddBoxRoundedIcon 
          color='neutral'
          onMouseEnter={event => event.currentTarget.style.cursor = "pointer"}
          onMouseLeave={event => event.currentTarget.style.cursor = "default"}
          onClick={handlePopoverChange}
        />
      </Grid>
    </Grid>
    {/* The popover for which is used the state. It's open operation is trigerred by clicking on + button in the side panel */}
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose= {handlePopoverClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
    >
      <Grid
        container
        alignItems="center"
        spacing={1}
        justifyContent="flex-start"
        sx={{padding:2, width: 230}}
      >
        <Grid item xs={12}>
          <Button 
            id={newQuestionTypes.QUIZ}
            color="primary" 
            variant="contained" 
            sx={{textTransform: 'none', width:'100%'}}
            onClick = {handleNewQuestionClick}
          >
            Quiz question
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            id={newQuestionTypes.TRUEFALSE}
            color="primary" 
            variant="contained" 
            sx={{textTransform: 'none', width: '100%'}}
            onClick = {handleNewQuestionClick}
          >
            True/false question
          </Button>
        </Grid>
      </Grid>
    </Popover>
  </>
  )
}

export default SidePanel;
