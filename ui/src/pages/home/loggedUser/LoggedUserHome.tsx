//@ts-ignore

import React, { useState } from "react";

import {
  Grid,
  Typography,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";

import { AnchorType } from "../Home";
import { Quiz, UserInterface } from "../../../common/types";
import { HashLoader } from "react-spinners";
import { deleteQuiz, loadAllQuizes } from "../../../api/quizApi";

interface LoggedUserHomeProps {
  currentUser: UserInterface;
}

//The home for logged in user. It displays the current user's
//quizzes and enables him to edit, delete or start (Start testing students) them
export default function LoggedUserHome({ currentUser }: LoggedUserHomeProps) {
  //The quizzes of logged in user, initialized to empty array and the is fetched from the server
  const [quizes, setQuizes] = useState<Array<Quiz>>([]);

  const [isLoading, setIsLoading] = useState(false);

  //The method used to find quiz by id in current quizzes
  const findQuizById = (id: number): Quiz => {
    let quizToReturn;
    quizes.forEach((quiz) => {
      if (quiz.id === id) {
        quizToReturn = quiz;
      }
    });
    return quizToReturn;
  };

  //Anchor state, holds the DOM element where the popover should be
  //displayed and id (key) of the quiz about which the popover displays possibilities
  const anchorInitial: AnchorType = {
    element: null,
    id: 0,
  };
  const [anchorEl, setAnchorEl] = React.useState<AnchorType>(anchorInitial);
  const open = Boolean(anchorEl.element);

  //Opens options about clicked quiz
  const handleOptionsOpen = (event, idToSet: number) => {
    setAnchorEl({
      element: event.currentTarget,
      id: idToSet,
    });
  };

  //Closes options
  const handleClose = () => {
    setAnchorEl(anchorInitial);
  };

  //Fetches all of the quizzes of current user
  //Not ideal but it did the trick for the school project. Also I don't suspect people
  //having more than 10 quizes and also one quiz doesn't contain that much data
  const fetchAllQuizzes = (id: number) => {
    setIsLoading(true);
    loadAllQuizes(id)
      .then((quizes) => {
        //@ts-ignore
        setQuizes(quizes);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  //Deletes the quiz the user chose to delete by it's id
  const handleDeleteQuiz = () => {
    deleteQuiz(anchorEl.id)
      .then(() => {
        handleClose();
        fetchAllQuizzes(currentUser.id);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      sx={{
        height: "calc(100vh - 45px)",
        width: "100%",
      }}
    >
      <Grid
        item
        xs
        sx={{
          backgroundColor: "white",
          height: "100%",
          padding: "40px 0 0 20px",
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          {isLoading ? (
            <HashLoader
              loading={true}
              size={50}
              color={"#7D93FF"}
              style={{ paddingTop: "20px" }}
            />
          ) : (
            <>
              {quizes.length === 0 ? (
                <Typography fontWeight={"bold"}>
                  You sadly don't have any created quizzes, create one using the
                  button at the top!
                </Typography>
              ) : (
                <>
                  <Grid item>
                    <Typography fontWeight={"bold"}>Your quizzes:</Typography>
                  </Grid>
                  {quizes.map((quiz) => (
                    <Grid item key={quiz.id} id={quiz.id?.toString()}>
                      <TextField
                        id="demo-positioned-button"
                        disabled
                        value={quiz.name}
                        aria-controls={
                          open ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(event) => handleOptionsOpen(event, quiz.id)}
                        size="small"
                        sx={{
                          width: "300px",
                          textTransform: "none",
                          borderRadius: 0,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SettingsIcon
                                onMouseEnter={(event) =>
                                  (event.currentTarget.style.cursor = "pointer")
                                }
                                onMouseLeave={(event) =>
                                  (event.currentTarget.style.cursor = "default")
                                }
                              />
                            </InputAdornment>
                          ),
                          style: {
                            fontWeight: "bold",
                          },
                        }}
                      />
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl.element}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={NavLink}
                          to={{
                            pathname: "/quiz",
                            state: findQuizById(anchorEl.id),
                          }}
                          onClick={handleClose}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteQuiz}>Delete</MenuItem>
                        <MenuItem
                          component={NavLink}
                          to={{
                            pathname: "/startQuiz",
                            state: findQuizById(anchorEl.id),
                          }}
                          onClick={handleClose}
                        >
                          Start
                        </MenuItem>
                      </Menu>
                    </Grid>
                  ))}
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
