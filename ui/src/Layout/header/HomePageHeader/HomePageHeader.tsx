import React from "react";
import { Grid, Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreateQuizDialog from "../../../common/EditQuizDialog/EditQuizDialog";
import { useDispatch } from "react-redux";
import { quizChanged } from "../../../redux/features/currentQuizSlice";
import { createNewQuizQuestion } from "../../../pages/quiz/helperMethods";
import { useHistory } from "react-router-dom";

interface HomePageHeaderProps {
  handleAccountOptionsOpen: (event) => void;
}

export default function HomePageHeader(props: HomePageHeaderProps) {
  const { handleAccountOptionsOpen } = props;

  const history = useHistory();

  const handleHomeClick = () => {
    history.push("/");
  };

  const dispatch = useDispatch();

  const [createQuizDialog, setCreateQuizDialog] = React.useState({
    open: false,
    quizName: "",
    quizDescription: "",
    //this may look like it should be derived state, however I don't want to check the error
    //until the user entered and then left the name field
    quizNameError: false,
  });

  const handleOpenDialog = () => {
    setCreateQuizDialog((prevDialog) => {
      return {
        ...prevDialog,
        open: true,
      };
    });
  };

  const handleDialogSubmit = () => {
    setCreateQuizDialog((prevDialog) => {
      return {
        ...prevDialog,
        open: false,
      };
    });
    dispatch(
      quizChanged({
        id: 0,
        name: createQuizDialog.quizName,
        description: createQuizDialog.quizDescription,
        questions: [createNewQuizQuestion(1)],
      })
    );
    history.push("/quiz", { name: createQuizDialog.quizName });
  };

  const handleDialogClose = () => {
    setCreateQuizDialog((prevDialog) => {
      return {
        ...prevDialog,
        open: false,
      };
    });
  };

  const handleDialogInputChange = (event) => {
    setCreateQuizDialog((prevDialog) => {
      return {
        ...prevDialog,
        [event.target.name]: event.target.value,
      };
    });
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
