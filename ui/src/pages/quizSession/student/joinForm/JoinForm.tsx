import React from "react";
import { Grid, TextField, Box, Typography, Button } from "@mui/material";

interface JoinFormProps {
  sessionId: React.RefObject<HTMLInputElement | null>;
  userName: React.RefObject<HTMLInputElement | null>;
  handleJoinQuizButton(event: React.MouseEvent<HTMLButtonElement>): void;
}

//The form with which the user can attempt to join the session. It has session id field and name field.
//When the user submits his attempt, the server checks whether an opened session with the id exists and 
//whether the name is already in the session
export default function JoinForm({
  sessionId,
  userName,
  handleJoinQuizButton,
}: JoinFormProps) {
  return (
    <Grid
      container
      direction="column"
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"} //Header has 45px
      sx={{
        height: "calc(100vh - 45px)",
      }}
    >
      <Grid
        item
        xs={1}
        sx={{
          width: "60%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography variant="h4">Join the quiz!</Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          width: "80%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <TextField
            placeholder="Session id"
            className="middleTextField"
            inputRef={sessionId}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          width: "80%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <TextField
            placeholder="Your name"
            className="middleTextField"
            inputRef={userName}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          width: "60%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinQuizButton}
          >
            Join
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
