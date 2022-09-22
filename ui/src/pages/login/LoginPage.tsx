import React from "react";
import { Grid } from "@mui/material";
import LoginForm from "./LoginForm";

//Displays login form for user
const LoginPage = () => (
  <Grid
    container
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "100vh" }}
  >
    <Grid item xs={8}>
      <LoginForm />
    </Grid>
  </Grid>
);

export default LoginPage;
