import React from 'react'
import { useState } from 'react';
import { Link } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(3),
  },
}));

const LoginForm = () => {
  const classes = useStyles();

  const emptyLoginData = {
    username: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(emptyLoginData);

  function handleChange(event){
    event.persist();
    setLoginData((loginData) => {
      return {...loginData, [event.target.id]: event.target.value,}
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    console.log(loginData)
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
  )
}

export default LoginForm;