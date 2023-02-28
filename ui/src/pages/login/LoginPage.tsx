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
    style={{ minHeight: "calc(100vh - 3.5rem)" }}
  >
    <Grid item xs={8}>
      <LoginForm />
    </Grid>
  </Grid>
);

export default LoginPage;
