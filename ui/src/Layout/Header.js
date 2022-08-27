import { Grid, Button, Popover, TextField, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  useUser,
  UserStatus,
  useUserUpdate,
  initialLoggedUserState,
} from "../context/UserContext";

//The header of the application.
//It is displayed differently based on current url location in the app and whether the user is guest or logged in
export default function Header(props) {
  //The location is saved in this variable, used in useEffect to find out when user changes the page and react to it
  const location = useLocation();
  //History used to move between pages
  const history = useHistory();
  //Name of the quiz, which is displayed while creating the quiz
  const quizName = useRef(null);

  //Current user and change user method from context
  const currentUser = useUser();
  const changeUser = useUserUpdate();

  //state used to define where the popover, which contains the new question type options, should get displayed (around which tag)
  const [anchorEl, setAnchorEl] = useState(null);

  //derived states
  //open says whether the popover is displayed or not
  let open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //Handles the popover. If popover is currently opened, it closes it and vice versa
  const handlePopoverChange = (event) => {
    open = !open;
    if (open) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };

  //Closes the popover
  const handlePopoverClose = () => setAnchorEl(null);

  //Handles create new quiz button, moves user to create quiz location with the name of the quiz
  const handleCreateClick = () => {
    history.push("/quiz", { name: quizName.current.value });
    handlePopoverClose();
  };

  //Logouts the user
  const handleLogout = () => {
    changeUser(initialLoggedUserState);
    history.push("/");
  };

  return (
    <>
      {location.pathname === "/login" ||
      location.pathname === "/registration" ||
      location.pathname === "/startQuiz" ? (
        <></>
      ) : (
        <>
          <header>
            <Grid
              container
              direction="row"
              spacing={0}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                height: 45,
                minHeight: 45,
                borderBottom: 1,
              }}
            >
              {/* 
              <Link to="/">
                <img alt="Carved Rock Fitness" src="/images/logo.png" />
              </Link>
            */}
              <Grid item sx={{ paddingLeft: 2 }}>
                {location.pathname === "/" &&
                  currentUser.status === UserStatus.Logged && (
                    <div style={{ fontWeight: "bold" }}>
                      {currentUser.email.split("@")[0]}
                    </div>
                  )}
              </Grid>
              <Grid item>
                {location.pathname === "/" &&
                  currentUser.status === UserStatus.Logged && (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={handlePopoverChange}
                      sx={{ textTransform: "none" }}
                    >
                      Create new quiz
                    </Button>
                  )}
                {location.pathname === "/quiz" && (
                  <Typography sx={{ fontWeight: "bold" }}>
                    Currently creating/updating quiz:{" "}
                    {history.location.state.name}
                  </Typography>
                )}
              </Grid>
              <Grid item sx={{ paddingRight: 2 }}>
                {location.pathname === "/" &&
                  currentUser.status === UserStatus.Logged && (
                    <div
                      style={{
                        color: "#545e6f",
                        borderRadius: "4px",
                        padding: 2,
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                      onMouseEnter={(event) =>
                        (event.currentTarget.style.cursor = "pointer")
                      }
                      onMouseLeave={(event) =>
                        (event.currentTarget.style.cursor = "default")
                      }
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  )}
              </Grid>
            </Grid>
          </header>
          <Popover
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
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
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
          </Popover>
        </>
      )}
    </>
  );
}
