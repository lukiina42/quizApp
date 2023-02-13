import React from "react";
import { Grid, TextField, Menu, MenuItem, InputAdornment } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";

import { Quiz } from "../../../../common/types";
import { AnchorType } from "../useAnchor";
import { findQuizById } from "../common";

interface QuizListProps {
  quizes: Quiz[];
  anchorOpen: boolean;
  handleAnchorOptionsOpen: (event, id: number) => void;
  handleAnchorClose: () => void;
  handleDeleteQuiz: (id: number) => void;
  anchor: AnchorType;
  handleQuizChange: (quiz: Quiz) => void;
}

export default function QuizList(props: QuizListProps) {
  const {
    quizes,
    anchorOpen,
    handleAnchorOptionsOpen,
    handleAnchorClose,
    handleDeleteQuiz,
    anchor,
    handleQuizChange,
  } = props;
  return (
    <>
      {quizes.map((quiz) => (
        <Grid item key={quiz.id} id={quiz.id?.toString()}>
          <TextField
            id="demo-positioned-button"
            disabled
            value={quiz.name}
            aria-controls={anchorOpen ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={anchorOpen ? "true" : undefined}
            onClick={(event) =>
              handleAnchorOptionsOpen(event, quiz.id as number)
            }
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
            anchorEl={anchor.element}
            open={anchorOpen}
            onClose={handleAnchorClose}
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
              onClick={() => handleQuizChange(findQuizById(anchor.id, quizes))}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeleteQuiz(quiz.id as number);
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              component={NavLink}
              to={{
                pathname: "/startQuiz",
                state: findQuizById(anchor.id, quizes),
              }}
              onClick={handleAnchorClose}
            >
              Start
            </MenuItem>
          </Menu>
        </Grid>
      ))}
    </>
  );
}
