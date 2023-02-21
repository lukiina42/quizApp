import React from "react";
import { Grid, Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreateQuizDialog from "../../../common/EditQuizDialog/EditQuizDialog";
import { useDispatch } from "react-redux";
import { quizChanged } from "../../../redux/features/currentQuizSlice";
import { createNewQuestion } from "../../../pages/quiz/helperMethods";
import { useHistory } from "react-router-dom";
import quizDialogReducer, {
  actionTypes,
} from "../quizDialogReducer/quizDialogReducer";
import { NewQuestionType } from "../../../common/types";

interface HomePageHeaderProps {
  handleAccountOptionsOpen: (event) => void;
  handleHomeClick: () => void;
}

const initialDialogState = {
  open: false,
  quizName: "",
  quizDescription: "",
  //this may look like it should be derived state, however I don't want to check the error
  //until the user entered and then left the name field
  quizNameError: false,
};

export default function HomePageHeader(props: HomePageHeaderProps) {
  const { handleAccountOptionsOpen, handleHomeClick } = props;

  const history = useHistory();

  const dispatch = useDispatch();

  const [createQuizDialog, dialogDispatch] = React.useReducer(
    quizDialogReducer,
    initialDialogState
  );

  const handleOpenDialog = () => {
    dialogDispatch({ type: actionTypes.OPEN });
  };

  const handleDialogSubmit = () => {
    dialogDispatch({ type: actionTypes.CLOSE });
    dispatch(
      quizChanged({
        id: 0,
        name: createQuizDialog.quizName,
        description: createQuizDialog.quizDescription,
        questions: [createNewQuestion(1, NewQuestionType.QUIZ)],
      })
    );
    history.push("/quiz", { name: createQuizDialog.quizName });
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

        <Grid item sx={{ paddingRight: 2 }}>
          <Box
            display={"flex"}
            flexDirection="row"
            alignItems={"center"}
            sx={{ gap: "1rem" }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleOpenDialog}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Create quiz
            </Button>
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
      <CreateQuizDialog
        handleDialogInputChange={handleDialogInputChange}
        open={createQuizDialog.open}
        handleSubmit={handleDialogSubmit}
        handleClose={handleDialogClose}
        headingText={"Insert the core information about your new quiz"}
        quizNameValue={createQuizDialog.quizName}
        quizDescriptionValue={createQuizDialog.quizDescription}
        submitText="Submit"
        cancelText="Cancel"
      />
    </>
  );
}
