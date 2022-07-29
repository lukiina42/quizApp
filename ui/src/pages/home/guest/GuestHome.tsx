import { Button, Grid } from "@mui/material"
import { useHistory } from 'react-router-dom'


//The home page for guest (not logged in user). It displays just 3 buttons with options to join the quiz, register or login
const GuestHome = () => {
  const history = useHistory()

  //handles buttons, moves user to different location based on which button did he click. The buttons have ids equal locations
  const handleButtons = (event): void => {
    history.push("/" + event.target.id)
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={0}
        justifyContent="center"
        sx={{
          height: "calc(100vh - 45px)",
          width: "100%",
          margin: 0
        }}
      >
        <Grid item>
          <Button
            id="joinQuiz"
            color="primary"
            variant="contained"
            size="large"
            sx={{width: 250, marginBottom: 5}}
            onClick={handleButtons}
          >
            Join a quiz
          </Button>
        </Grid>
        <Grid item>
          <Button
            id="login"
            color="primary"
            variant="contained"
            size="large"
            sx={{width: 250, marginBottom: 5}}
            onClick={handleButtons}
          >
            Login
          </Button>
        </Grid>
        <Grid item>
          <Button
            id="registration"
            color="primary"
            variant="contained"
            size="large"
            sx={{width: 250}}
            onClick={handleButtons}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default GuestHome