import React from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import EditQuizDialog from "../../../common/EditQuizDialog/EditQuizDialog";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import quizDialogReducer, {
  actionTypes,
} from "../quizDialogReducer/quizDialogReducer";
import { useDispatch, useSelector } from "react-redux";
import { quizChanged } from "../../../redux/features/currentQuizSlice";
import { Quiz } from "../../../common/types";
import EditIcon from "@mui/icons-material/Edit";

interface EditQuizHeaderProps {
  handleAccountOptionsOpen: (event) => void;
  handleHomeClick: () => void;
}

export default function EditQuizHeader(props: EditQuizHeaderProps) {
  const { handleAccountOptionsOpen, handleHomeClick } = props;

  //get quiz from redux because I can
  const { quiz } = useSelector((state) => state) as { quiz: Quiz };

  const dispatch = useDispatch();

  const [editQuizDialog, dialogDispatch] = React.useReducer(quizDialogReducer, {
    open: false,
    quizName: quiz.name,
    //@ts-ignore
    quizDescription: quiz.description,
    quizNameError: false,
  });

  const handleOpenDialog = () => {
    dialogDispatch({ type: actionTypes.OPEN });
  };

  const handleDialogSubmit = () => {
    // dialogDispatch({ type: actionTypes.CLOSE });
    // dispatch(
    //   quizChanged({
    //     id: 0,
    //     name: createQuizDialog.quizName,
    //     description: createQuizDialog.quizDescription,
    //     questions: [createNewQuizQuestion(1)],
    //   })
    // );
    // history.push("/quiz", { name: createQuizDialog.quizName });
  };

  const handleDialogClose = () => {
    dialogDispatch({ type: actionTypes.CLOSE });
  };

  const handleDialogInputChange = (event) => {
    dialogDispatch({ type: actionTypes.INPUTCHANGE, event });
  };

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

        <Grid item>
          <Box
            display={"flex"}
            flexDirection="row"
            gap={"1rem"}
            alignItems="center"
            sx={{
              ":hover": {
                cursor: "pointer",
              },
            }}
            onClick={handleOpenDialog}
          >
            <Typography
              variant="h6"
              fontSize={"md"}
              sx={{ fontWeight: "bold" }}
            >
              {quiz.name}
            </Typography>
            <EditIcon />
          </Box>
        </Grid>

        <Grid item sx={{ paddingRight: 2 }}>
          <Box
            display={"flex"}
            flexDirection="row"
            alignItems={"center"}
            sx={{ gap: "1rem" }}
          >
            <AccountCircleIcon
              fontSize="large"
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
                color: "#43b587",
              }}
              onClick={handleAccountOptionsOpen}
            />
          </Box>
        </Grid>
      </Grid>
      <EditQuizDialog
        handleDialogInputChange={handleDialogInputChange}
        open={editQuizDialog.open}
        handleSubmit={handleDialogSubmit}
        handleClose={handleDialogClose}
        headingText={"Insert the core information about your new quiz"}
        quizNameValue={editQuizDialog.quizName}
        quizDescriptionValue={editQuizDialog.quizDescription}
        submitText="Submit"
        cancelText="Cancel"
      />
    </>
  );
}
