import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Grid, Typography, Box } from "@mui/material";

export default function SidePanelItem({
  handleQuestionClick,
  question,
  currentQuestionData,
  handleDeleteQuestion,
}) {
  return (
    //@ts-ignore
    <Grid
      item
      key={question.key}
      id={question.key}
      draggable={true}
      className="draggable"
    >
      <Grid
        container
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        flexWrap={"nowrap"}
        sx={{
          backgroundColor: "#D0CDF5",
          padding: "7px 5.5px 7px 5.5px",
          margin: "20px 0 20px 0",
          border: "2px solid #B2ADFD",
          borderRadius: "4px",
          maxWidth: "9rem",
          width: "9rem",
          height: "4rem",
          maxHeight: "4rem",
        }}
      >
        <Box
          component={"div"}
          id={question.key.toString()}
          onClick={handleQuestionClick}
          onMouseEnter={(event) =>
            (event.currentTarget.style.cursor = "pointer")
          }
          onMouseLeave={(event) =>
            (event.currentTarget.style.cursor = "default")
          }
          style={{
            height: "100%",
          }}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
        >
          {
            <Typography
              sx={{
                fontWeight:
                  currentQuestionData.questionKey === question.key
                    ? "bold"
                    : "500",
                display: "-webkit-box",
                maxWidth: "6.5rem",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {question.name}
            </Typography>
          }
        </Box>
        <DeleteIcon
          color="info"
          onClick={() => handleDeleteQuestion(question.key)}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = "#B2ADFD";
            event.currentTarget.style.color = "black";
            event.currentTarget.style.cursor = "pointer";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = "inherit";
            event.currentTarget.style.color = "#64748B";
            event.currentTarget.style.cursor = "default";
          }}
          sx={{
            borderRadius: "5px",
          }}
        />
      </Grid>
    </Grid>
  );
}
