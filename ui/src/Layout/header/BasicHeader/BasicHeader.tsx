import React from "react";
import { Grid, Box } from "@mui/material";

export default function BasicHeader({ handleHomeClick }) {
  return (
    <>
      <Grid
        container
        direction="row"
        spacing={0}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: "3.5rem",
          minHeight: "3.5rem",
          borderBottom: "1px solid #edf4ff",
        }}
      >
        <Grid item sx={{ paddingLeft: 2 }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="logo"
            height={"32px"}
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
            onClick={handleHomeClick}
          ></Box>
        </Grid>
      </Grid>
    </>
  );
}
