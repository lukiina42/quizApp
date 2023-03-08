import React from "react";
import { Grid, Button } from "@mui/material";
import Popover from "@mui/material/Popover";
import "react-toastify/dist/ReactToastify.css";
import { NewQuestionType } from "../../../../common/types";

export default function NewQuestionPopover({
  id,
  open,
  anchorEl,
  handlePopoverClose,
  handleNewQuestion,
}) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
    >
      <Grid
        container
        alignItems="center"
        spacing={1}
        justifyContent="flex-start"
        sx={{
          padding: 2,
          width: 230,
        }}
      >
        <Grid item xs={12}>
          <Button
            id={NewQuestionType.QUIZ}
            color="primary"
            variant="contained"
            sx={{
              textTransform: "none",
              width: "100%",
            }}
            onClick={(e) => {
              handlePopoverClose();
              handleNewQuestion(NewQuestionType.QUIZ);
            }}
          >
            Quiz question
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            id={NewQuestionType.TRUEFALSE}
            color="primary"
            variant="contained"
            sx={{
              textTransform: "none",
              width: "100%",
            }}
            onClick={() => {
              handlePopoverClose();
              handleNewQuestion(NewQuestionType.TRUEFALSE);
            }}
          >
            True/false question
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
}
