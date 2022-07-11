import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(3),
  },
  error: {
    color: "red",
    margin: 0,
    fontSize: 13
  }
}));

const RegistrationForm = () => {
  const classes = useStyles();

  const touchedInitial = {
    email: false,
    password: false,
    passwordAgain: false,
    lastTouched: ""
  }

  const initialData = {
    email: "",
    password: "",
    passwordAgain: "",
  };

  const [registrationData, setRegistrationData] = useState(initialData);
  const [touched, setTouched] = useState(touchedInitial);
  const [errors, setErrors] = useState(initialData);

  function isUpper(str) {
    const pattern = new RegExp("^(?=.*[A-Z]).+$")
    return pattern.test(str)
  }

  //errors
  useEffect(() => {
    async function checkErrors() {
      let error = ""
      switch(touched.lastTouched){
        case "email":
          if(touched.email){
            if (!registrationData.email){
              error = "Email is required"
            }else if(registrationData.email.length < 3){
              error = "Email should contain at least 3 characters"
            }else if(!registrationData.email.includes("@")){
              error = "Email should contain @ symbol"
            }else if(!registrationData.email.includes(".")){
              error = "Email should contain highest order domain"
            }else if(await emailExists(registrationData.email)){
              error = "This email is already used"
            }
            setErrors((currErrors) => {return {...currErrors, email: error}})
          }
          break;
        case "password":
          if(touched.password){
            if (!registrationData.password){
              error = "Password is required"
            }else if(registrationData.password.length < 5){
              error = "Password should contain at least 5 characters"
            }else if(!isUpper(registrationData.password)){
              error = "Password should contain a capital letter"
            }
            setErrors((currErrors) => {return {...currErrors, password: error}})
          }
          break;
        case "passwordAgain":
          if(touched.passwordAgain){
            if(registrationData.password.localeCompare(registrationData.passwordAgain) !== 0){
              error = "Passwords must match"
            }
            setErrors((currErrors) => {return {...currErrors, passwordAgain: error}})
          }
          break;
        default:
          break;
        }
      }

      checkErrors();
    }, [registrationData, touched])

    function handleChange(event){
      event.persist();
      // To enable submit button 
      // Without this user would first have to blur out of the text field to enable submit button
      if(event.target.id === "passwordAgain" && event.target.value === registrationData.password){
        setTouched((cur) => {
          return { ...cur, [event.target.id]: true };
        });
      }
      setRegistrationData((currRegData) => {
        return {...currRegData, [event.target.id]: event.target.value,}
    })
  }

  function handleBlur(event){
    event.persist();
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true, lastTouched: event.target.id };
    });
  }

  function handleSubmit(event){
    event.preventDefault()
    const dataToSend = {email: registrationData.email, password: registrationData.password}
    fetch("http://localhost:8080/betterKahoot/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend), // body data type must match "Content-Type" header
    })
    .then(response => {
      if(response.status === 201){
        alert("you are now registered")
      }
    })
    .catch(error => console.log(error));
  }

  function emailExists(email){
    return fetch("http://localhost:8080/betterKahoot/users/" + email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      })
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));
  }

  return (
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
            <Typography variant="h4">Registration</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={errors.email !== "" && touched.email}
              id="email"
              label={(errors.email !== "" && touched.email) ? errors.email : "Email"}
              autoFocus
              size="small"
              onChange={handleChange}
              onBlur={handleBlur}
              value={registrationData.email}
              sx={{width: 300}}
            />
            {/* {errors.email && touched.email && <p className={classes.error} role="alert">{errors.email}</p>} */}
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={errors.password !== "" && touched.password}
              id="password"
              label={(errors.password !== "" && touched.password) ? errors.password : "Password"}
              size="small"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={registrationData.password}
              sx={{width: 300}}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={errors.passwordAgain !== "" && touched.passwordAgain}
              id="passwordAgain"
              label={(errors.passwordAgain !== "" && touched.passwordAgain) ? errors.passwordAgain : "Password, just to make sure :)"}
              size="small"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={registrationData.passwordAgain}
              sx={{width: 300}}
            />
          </Grid>
          <Grid item xs={3}>
            <Button color="primary" variant="contained" type="submit" 
            disabled={JSON.stringify(errors) !== JSON.stringify(initialData) || !touched.email || !touched.password || !touched.passwordAgain}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Link to='/'>Already have an accout?</Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RegistrationForm;