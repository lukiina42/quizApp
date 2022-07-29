//@ts-ignore

import React from "react";

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
import { Quiz } from "../../../common/types";

interface LoggedUserHomeProps {
  quizes: Array<Quiz>;
  findQuizById(id: number): Quiz;
  handleDeleteQuiz(): void;
  handleClose(): void;
  anchorEl: AnchorType;
  open: boolean;
  handleOptionsOpen(event, id: number): void;
}

//The home for logged in user. It displays the current user's 
//quizzes and enables him to edit, delete or start (Start testing students) them
export default function LoggedUserHome({
  quizes,
  findQuizById,
  handleDeleteQuiz,
  handleClose,
  anchorEl,
  open,
  handleOptionsOpen,
}: LoggedUserHomeProps) {
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
        <Grid container direction="column" spacing={2} alignItems="center" justifyContent="center">
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
                    aria-controls={open ? "demo-positioned-menu" : undefined}
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
        </Grid>
      </Grid>
    </Grid>
  );
}
