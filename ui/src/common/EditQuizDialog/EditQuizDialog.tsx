import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
} from "@mui/material/";

interface EditQuizDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  submitText: string;
  cancelText: string;
  headingText: string;
  handleDialogInputChange: (event) => void;
  quizDescriptionValue: string;
  quizNameValue: string;
}

export default function EditQuizDialog(props: EditQuizDialogProps) {
  const {
    open,
    handleSubmit,
    handleClose,
    submitText,
    cancelText,
    headingText,
    handleDialogInputChange,
    quizNameValue,
    quizDescriptionValue,
  } = props;

  const quizNameTouched = React.useRef(false);

  const quizNameError = (() => {
    if (!quizNameTouched.current) return "";
    if (quizNameValue === "") return "Quiz name is required";
    if (quizNameValue.length > 32)
      return "Quiz name can have at most 32 characters";
    return "";
  })();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{headingText}</DialogTitle>
        <DialogContent>
          <Box
            height={"100%"}
            display={"flex"}
            flexDirection="column"
            justifyContent={"center"}
            alignItems="flex-start"
            gap={"1rem"}
            mt="0.5rem"
          >
            <TextField
              error={quizNameError !== ""}
              name="quizName"
              id="quizName"
              label={!quizNameError ? "Quiz name*" : quizNameError}
              size="small"
              type="text"
              onChange={handleDialogInputChange}
              onBlur={() => (quizNameTouched.current = true)}
              value={quizNameValue}
              fullWidth
            />
            <TextField
              name="quizDescription"
              id="quizDescription"
              label="Quiz description"
              size="small"
              type="text"
              multiline
              minRows={3}
              maxRows={10}
              onChange={handleDialogInputChange}
              value={quizDescriptionValue}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button sx={{ fontWeight: "bold" }} onClick={handleClose}>
            {cancelText}
          </Button>
          <Button
            sx={{ fontWeight: "bold" }}
            color="secondary"
            onClick={quizNameError === "" ? handleSubmit : () => {}}
            autoFocus
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
