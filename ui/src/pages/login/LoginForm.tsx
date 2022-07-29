import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useUser, useUserUpdate, UserStatus } from '../../context/UserContext';
import { UserInterface } from '../../common/types';
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

//box styling
const useStyles = makeStyles((theme) => ({
  box: {
    //@ts-ignore
    padding: theme.spacing(3),
  },
}));

//The login form for the user, displays the field for username and password
const LoginForm = () => {
  //styling
  const classes = useStyles()
  //History used to move user to different location
  const history = useHistory()

  //Current user, when the user comes to login page, he is usually not logged in, so user is at the initial state,
  // but after typing correct credentials, current user is changed and the user is moved to home page
  const currentUser = useUser()

  //initial login data
  const emptyLoginData = {
    username: "",
    password: "",
  };

  //Handles what user types in the form
  const [loginData, setLoginData] = useState(emptyLoginData);
  //Method to udpate user
  const changeUser = useUserUpdate()

  //When current user changes (user logged in), move them to home page
  useEffect(() => {
    if(currentUser.status === UserStatus.Logged){
      history.push("/")
    }
  }, [currentUser, history])

  //Handles user's input in the form
  function handleChange(event){
    event.persist();
    setLoginData((loginData) => {
      return {...loginData, [event.target.id]: event.target.value}
    })
  }

  //Handles the login after user clicked on submit button. It displays notification if the credentials are not correct,
  // otherwise it moves user to the home page
  const loginUser = (userData) => {
    //if id is 0, the credentials user typed are not correct
    if(userData.id === 0){
      toast.warn("The password and email don't match :(", {
        position: "top-center",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    const userToLogin: UserInterface = {
      id: userData.id,
      email: userData.email,
      status: UserStatus.Logged
    } 
    //@ts-ignore
    changeUser(userToLogin)
  }

  //Asks server whether the credentials are correct
  function handleSubmit(event){
    event.preventDefault()
    const dataToSend = {email: loginData.username, password: loginData.password}
    fetch("http://localhost:8080/betterKahoot/users/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend), // body data type must match "Content-Type" header
    })
    .then(response => {
      if(response.status !== 200){
        throw new Error("Server was unable to handle the request")
      }
      return response.json()
    })
    .then(responseData => loginUser(responseData))
    .catch(error => console.log(error));
  }

  return (
    <>
      {/* Notifications for user, when he doesn't type correct email and password */}
      <ToastContainer
        position="top-center"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Box className={classes.box} maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={3}
            justifyContent="center"
          >
            <Grid item xs={3}>
              <Typography variant="h4">Login</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="username"
                label="Username"
                size="small"
                onChange={handleChange}
                value={loginData.username}
                sx={{width: 300}}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="password"
                label="Password"
                size="small"
                type={"password"}
                onChange={handleChange}
                value={loginData.password}
                sx={{width: 300}}
              />
            </Grid>
            <Grid item xs={3}>
              <Button color="primary" variant="contained" type="submit">Submit</Button>
            </Grid>
            <Grid item xs={3}>
              <Link to='registration'>Don't have an account yet?</Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  )
}

export default LoginForm;