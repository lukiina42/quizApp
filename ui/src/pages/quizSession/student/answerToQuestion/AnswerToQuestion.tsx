import QuizAnswers from "../../../quiz/questionParameters/answers/QuizAnswers";
import { Button, Grid } from "@mui/material";
import { QuizQuestionAnswer } from "../../../../common/types";

interface AnswerToQuestionProps {
  currentAnswers: QuizQuestionAnswer[];
  handleAnswerCorrectChange: (key: string) => void;
  handleSendAnswersButton(): void;
}

//Displays the possible answers to the question and lets user decide which answers they think are correct and submit the choice
function AnswerToQuestion({
  currentAnswers,
  handleSendAnswersButton,
  handleAnswerCorrectChange,
}: AnswerToQuestionProps) {
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        height: "calc(100vh - 3.5rem)",
        width: "100%",
      }}
    >
      <div className="answersDiv">
        <QuizAnswers
          disabled
          quizAnswers={
            currentAnswers
              ? (currentAnswers as QuizQuestionAnswer[])
              : undefined
          }
          handleAnswerCorrectChange={handleAnswerCorrectChange}
          allowCorrectSwitch
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendAnswersButton}
          size="large"
          sx={{
            width: "180px",
          }}
        >
          Send choice
        </Button>
      </div>
    </Grid>
  );
}

export default AnswerToQuestion;
