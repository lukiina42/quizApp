import { Grid } from "@mui/material";
import React from "react";

//footer of the application, didn't find a use case for this yet, but might be useful in the future
function Footer() {
  return (
    <Grid
      container
      direction="row"
      spacing={3}
      justifyContent="center"
      height={"5vh"}
    >
      <h1>This is footer</h1>
    </Grid>
  );
}

export default Footer;
