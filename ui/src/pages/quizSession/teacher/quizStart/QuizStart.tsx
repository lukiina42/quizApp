import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { HashLoader } from "react-spinners";

export default function QuizStart({
  sessionId,
  quiz,
  users,
  handleNextQuestionButton,
}) {
  return (
    <Grid
      container
      direction={"column"}
      alignItems={"center"}
      justifyContent={"flex-start"}
      sx={{
        height: "calc(100vh - 3.5rem)",
        width: "100%",
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          {quiz.name}
        </Box>
      </Grid>
      <Grid item xs={1}>
        <Box
          sx={{
            fontSize: "20px",
            display: "flex",
          }}
        >
          {sessionId !== 0 ? (
            <>
              <Typography>Session id for students:</Typography>
              <Typography fontWeight={"bold"}>{sessionId}</Typography>
            </>
          ) : (
            <HashLoader loading={true} size={50} color={"#7D93FF"} />
          )}
        </Box>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={"bold"} fontSize={"20"}>
          The users currently connected to the quiz:
        </Typography>
      </Grid>
      <Grid
        item
        xs
        sx={{
          width: "90%",
        }}
      >
        <Grid
          container
          justifyContent={"center"}
          sx={{
            width: "100%",
          }}
        >
          {users.map((user) => (
            <Grid item key={user}>
              <ListItemButton
                onMouseEnter={(event) =>
                  (event.currentTarget.style.cursor = "default")
                }
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={user} />
              </ListItemButton>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={2}>
        {users.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestionButton}
          >
            Start the quiz
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
