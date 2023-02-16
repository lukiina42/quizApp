import React, { useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  useUser,
  UserStatus,
  useUserUpdate,
  initialLoggedUserState,
} from "../../context/UserContext";
import { useDispatch } from "react-redux";
import { quizChanged } from "../../redux/features/currentQuizSlice";
import { createNewQuizQuestion } from "../../pages/quiz/helperMethods";
import HomePageHeader from "./HomePageHeader/HomePageHeader";

//The header of the application.
//It is displayed differently based on current url location in the app and whether the user is guest or logged in
export default function Header() {
  //The location is saved in this variable, used in useEffect to find out when user changes the page and react to it
  const location = useLocation();
  //History used to move between pages
  const history = useHistory();
  //Name of the quiz, which is displayed while creating the quiz
  const quizName = useRef(null);

  const dispatch = useDispatch();

  //Current user and change user method from context
  const currentUser = useUser();
  const changeUser = useUserUpdate();

  //Handles create new quiz button, moves user to create quiz location with the name of the quiz
  const handleCreateClick = () => {
    //@ts-ignore
    const name = quizName.current?.value;
    dispatch(
      quizChanged({
        id: 0,
        name,
        questions: [createNewQuizQuestion(1)],
      })
    );
    history.push("/quiz", { name });
    //handlePopoverClose();
  };

  //Logouts the user
  const handleLogout = (): void => {
    //@ts-ignore
    changeUser(initialLoggedUserState);
    history.push("/");
  };

  const getCurrentHeader = () => {
    if (
      location.pathname === "/quiz" &&
      currentUser.status === UserStatus.Logged
    ) {
      //todo
      return <EditQuizHeader />;
    }
    if (location.pathname === "/" && currentUser.status === UserStatus.Logged) {
      return (
        <HomePageHeader
          userEmail={currentUser.email.split("@")[0]}
          handleLogout={handleLogout}
        />
      );
    }
    return <></>;
  };

  return (
    <>
      <header>{getCurrentHeader()}</header>
    </>
  );
}

{
  /* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Grid
          container
          alignItems="center"
          spacing={1}
          justifyContent="flex-start"
          sx={{ padding: 2, width: 300 }}
        >
          <Grid item xs={12}>
            <TextField
              id="theQuestion"
              size="small"
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              placeholder="Name of quiz"
              autoComplete="new-password"
              fullWidth
              inputRef={quizName}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="secondary"
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={handleCreateClick}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </Popover> */
}
