import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertDialogProps {
  open: boolean;
  handleDecline: () => void;
  handleConfirm: () => void;
  confirmText: string;
  declineText: string;
  headingText: string;
}

export default function AlertDialog(props: AlertDialogProps) {
  const {
    open,
    handleDecline,
    handleConfirm,
    confirmText,
    declineText,
    headingText,
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDecline}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{headingText}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone</DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <Button sx={{ fontWeight: "bold" }} onClick={handleDecline}>
            {declineText}
          </Button>
          <Button
            sx={{ fontWeight: "bold" }}
            color="error"
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
