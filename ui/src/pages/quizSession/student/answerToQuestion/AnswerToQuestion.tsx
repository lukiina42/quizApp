import Answers from "../../../quiz/questionParameters/answers/Answers";
import { Button, Grid } from "@mui/material";
import { QuizAnswers } from "../../../../common/types";
interface AnswerToQuestionProps {
  currentAnswers: QuizAnswers | null;
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
        height: "calc(100vh - 45px)",
        width: "100%",
      }}
    >
      <div className="answersDiv">
        <Answers
          disabled
          quizAnswers={currentAnswers ? currentAnswers : undefined}
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
