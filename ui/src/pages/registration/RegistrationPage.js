import React from "react";
import { Grid } from "@mui/material";
import RegistrationForm from "./RegistrationForm";

//Displays registration form
const RegistrationPage = () => (
  <Grid
    container
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "100vh" }}
  >
    <Grid item xs={8}>
      <RegistrationForm />
    </Grid>
  </Grid>
);

export default RegistrationPage;
