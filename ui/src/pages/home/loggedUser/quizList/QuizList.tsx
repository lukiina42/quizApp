import React from "react";
import { Menu, MenuItem, Divider } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";
import { Quiz } from "../../../../common/types";
import { AnchorType } from "../useAnchor";
import { findQuizById } from "../common";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

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
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <Divider key={"lol"} />
        {quizes.map((quiz, key) => (
          <React.Fragment key={quiz.id}>
            <ListItem
              key={quiz.id}
              id={quiz.id!.toString()}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                transition: "0.3s ease-in",
                ":hover": {
                  backgroundColor: "#e0e0e0",
                  cursor: "pointer",
                },
              }}
              onClick={(event) =>
                handleAnchorOptionsOpen(event, quiz.id as number)
              }
            >
              <ListItemText
                primary={
                  <Typography
                    color={"black"}
                    variant="h5"
                    sx={{ fontWeight: "bold" }}
                  >
                    {quiz.name.toUpperCase()}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{ display: "inline", fontWeight: "bold" }}
                    component="span"
                    variant="body2"
                    color="#87b0d4"
                  >
                    This is an absolute description lulw
                  </Typography>
                }
              />
              <SettingsIcon
                color="info"
                onMouseEnter={(event) =>
                  (event.currentTarget.style.cursor = "pointer")
                }
                onMouseLeave={(event) =>
                  (event.currentTarget.style.cursor = "default")
                }
              />
            </ListItem>
            <Divider key={-quiz.id!} />
          </React.Fragment>
        ))}
      </List>
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
            handleDeleteQuiz(anchor.id);
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
    </>
  );
}
