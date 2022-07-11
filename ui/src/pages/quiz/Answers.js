import React from "react";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { TextField, Grid, Tooltip, InputAdornment } from "@mui/material";
import { tooltipClasses } from "@mui/material";
import { styled, makeStyles } from '@mui/styles';

//Custom styling of the tooltip, which gets displayed, when user hoovers over thumbs up and down icons in the answers field
const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 160,
    textAlign:"center",
    backgroundColor: "#373737"
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#373737"
  }
});

const useStyles = makeStyles((theme) => ({
}));

const Answers = (props) => {
  const classes = useStyles()

  const {newQuestionTypes, setAnswersCorrect, questionParams, answersCorrect, answersValues, handleAnswerValueChange} = props
  //Custom adornment of the tooltip, it is used 4 times for the answers, that's why it is extracted into the variable
  const AdornmentCustom = (props) =>{
    const {id} = props
    return (
    <InputAdornment position="end">
      <CustomTooltip className={classes.tooltip} title={answersCorrect[id] ? "Thumbs up: correct answer Click to toggle" : "Thumbs down: incorrect answer Click to toggle"} placement="top" arrow>
        {answersCorrect[id] ?
        <ThumbUpIcon
          color="secondary"
          onClick = {() => setAnswersCorrect({...answersCorrect, [id]: !answersCorrect[id]})}
          onMouseEnter={event => event.currentTarget.style.cursor = "pointer"}
          onMouseLeave={event => event.currentTarget.style.cursor = "default"} /> :
        <ThumbDownIcon 
          color="error"
          onClick = {() => setAnswersCorrect({...answersCorrect, [id]: !answersCorrect[id]})}
          onMouseEnter={event => event.currentTarget.style.cursor = "pointer"}
          onMouseLeave={event => event.currentTarget.style.cursor = "default"}
        />
        }
      </CustomTooltip>
    </InputAdornment>
    )
  }

  return (
      <>
      <Grid
        container
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={6}>
          <TextField
            id={"topLeftAnswer"}
            multiline
            maxRows={3}
            value={answersValues.topLeftAnswer}
            onChange={handleAnswerValueChange}
            size="small"
            inputProps={{style: { textAlign: 'center' }}}
            sx={{width:'100%', backgroundColor: '#66A4FF', borderRadius: '4px', overflow: 'hidden'}}
            InputProps={{
              endAdornment:<AdornmentCustom id="TopLeft"/>
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id={"topRightAnswer"}
            multiline
            maxRows={3}
            value={answersValues.topRightAnswer}
            onChange={handleAnswerValueChange}
            size="small"
            inputProps={{style: { textAlign: 'center' }}}
            sx={{width:'100%', backgroundColor: "#B456EB", borderRadius: '4px'}}
            InputProps={{
              endAdornment:<AdornmentCustom id="TopRight"/>
            }}
          />
        </Grid>
        {questionParams.currentQuestion.type === newQuestionTypes.QUIZ && 
        <>
          <Grid item xs={6}>
            <TextField
            id={"bottomLeftAnswer"}
            multiline
            maxRows={3}
            value={answersValues.bottomLeftAnswer}
            onChange={handleAnswerValueChange}
            size="small"
            inputProps={{style: { textAlign: 'center' }}}
            sx={{width:'100%', backgroundColor: "#EB9B56", borderRadius: '4px'}}
            InputProps={{
              endAdornment:<AdornmentCustom id="BottomLeft"/>
            }}
          />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id={"bottomRightAnswer"}
              multiline
              maxRows={3}
              value={answersValues.bottomRightAnswer}
              onChange={handleAnswerValueChange}
              size="small"
              inputProps={{style: { textAlign: 'center' }}}
              sx={{width:'100%', backgroundColor: "#FFFF99", borderRadius: '4px'}}
              InputProps={{
                endAdornment:<AdornmentCustom id="BottomRight"/>
              }}
          />
          </Grid>
        </>
      }
      </Grid>
    </>
  )
}

export default Answers