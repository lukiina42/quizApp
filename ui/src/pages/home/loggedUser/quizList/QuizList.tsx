import React from "react";
import { Box, Chip, Button } from "@mui/material";
import { Quiz } from "../../../../common/types";
import Typography from "@mui/material/Typography";
import "./index.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AlertDialog from "../../../../common/ConfirmationDialog/ConfirmationDialog";
import { useHistory } from "react-router-dom";

interface QuizListProps {
  quizes: Quiz[];
  handleDeleteQuiz: (id: number) => void;
  handleQuizChange: (quiz: Quiz) => void;
}

export default function QuizList(props: QuizListProps) {
  const { quizes, handleDeleteQuiz, handleQuizChange } = props;

  const history = useHistory();

  const [deleteConfirmationDialog, setDeleteConfirmationDialog] =
    React.useState({
      open: false,
      quizId: 0,
      quizName: "",
    });

  const handleDialogConfirm = () => {
    handleDeleteQuiz(deleteConfirmationDialog.quizId);
    setDeleteConfirmationDialog((prevDialog) => {
      return {
        ...prevDialog,
        open: false,
      };
    });
  };

  const handleDialogDecline = () => {
    setDeleteConfirmationDialog((prevDialog) => {
      return {
        ...prevDialog,
        open: false,
      };
    });
  };

  return (
    <>
      <AlertDialog
        open={deleteConfirmationDialog.open}
        handleConfirm={handleDialogConfirm}
        handleDecline={handleDialogDecline}
        headingText={`Are you sure you want to delete ${deleteConfirmationDialog.quizName}?`}
        confirmText="Delete"
        declineText="Cancel"
      />
      <Box
        width={{ xs: "90%", sm: "80%", md: "60%" }}
        maxWidth={1000}
        sx={{
          bgcolor: "background.paper",
          gap: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {quizes.map((quiz) => (
          <React.Fragment key={quiz.id}>
            <Box
              width={"100%"}
              minHeight={"6rem"}
              display="flex"
              flexDirection={"row"}
              justifyContent="space-between"
              className="bounceBox"
              sx={{
                borderRadius: "5px",
                padding: "5px 10px",
                boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease-in",
                ":hover": {
                  animation: "bounce 0.3s",
                  cursor: "pointer",
                },
              }}
            >
              <Box
                width={"60%"}
                display="flex"
                flexDirection={"column"}
                gap="1rem"
              >
                <Typography
                  color={"black"}
                  variant="h5"
                  sx={{ fontWeight: "bold" }}
                >
                  {quiz.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                  component="span"
                  variant="body2"
                  color="#87b0d4"
                >
                  {/* @ts-ignore */}
                  {quiz.description}
                </Typography>
                <Box width="auto">
                  <Chip
                    label={`${quiz.questions.length} ${
                      quiz.questions.length === 1 ? "question" : "questions"
                    }`}
                    color="primary"
                  />
                </Box>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <DeleteOutlineIcon
                    className="trash-icon"
                    fontSize="medium"
                    color="error"
                    sx={{
                      padding: "2px",
                      borderRadius: "5px",
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                    onClick={() =>
                      setDeleteConfirmationDialog({
                        open: true,
                        quizId: quiz.id as number,
                        quizName: quiz.name,
                      })
                    }
                  />
                </Box>
                <Box display={"flex"} flexDirection="row" gap={"0.5rem"}>
                  <Button
                    sx={{
                      transition: "0.2s all ease-in",
                      bgcolor: "#053e85",
                      textTransform: "none",
                      fontWeight: "bold",
                      ":hover": {
                        bgcolor: "#03326b",
                      },
                    }}
                    size="small"
                    variant="contained"
                    onClick={() => handleQuizChange(quiz)}
                  >
                    Edit
                  </Button>
                  <Button
                    sx={{
                      transition: "0.2s all ease-in",
                      bgcolor: "#053e85",
                      textTransform: "none",
                      fontWeight: "bold",
                      ":hover": {
                        bgcolor: "#03326b",
                      },
                    }}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/startQuiz", { quiz })}
                  >
                    Start
                  </Button>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </>
  );
}
