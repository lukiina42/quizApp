import React from "react";
import { makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./index.css";
import { QuestionEvaluationType } from "../types";
import {
  Question,
  LanguageType,
  NewQuestionType,
} from "../../../../common/types";
import CustomCodeEditor from "../../../quiz/questionParameters/codeEditor/CustomCodeEditor";
import CustomTooltip from "./CustomTooltip";
import AnswersEvaluation from "./answersEvaluation/quizAnswersEvaluation/AnswersEvaluation";
import TrueFalseAnswersEvaluation from "./answersEvaluation/trueFalseAnswersEvaluation/TrueFalseAnswersEvaluation";

interface QuestionEvaluationProps {
  questionEvaluation: QuestionEvaluationType | null;
  currentQuestion: Question | null;
  handleNextQuestionButton(): void;
  handleShowStudentResults(): void;
  lastQuestion: boolean;
}

const useStyles = makeStyles(() => ({
  textField: {
    //assuring that even when the text fields are disabled, the font color stays black
    "& .MuiInputBase-root": {
      "& .Mui-disabled": {
        "-webkit-text-fill-color": "rgba(0, 0, 0, 1)",
      },
    },
  },
}));

//displays the evaluation of the quiz with info about how many students were correct with their choices
//and how many times was each answer marked as correct
const QuestionEvaluation = ({
  questionEvaluation,
  currentQuestion,
  handleNextQuestionButton,
  lastQuestion,
  handleShowStudentResults,
}: QuestionEvaluationProps) => {
  const classes = useStyles();

  //Count total answers in the quiz
  const totalAnswers =
    (questionEvaluation?.amountOfAnswersTotal
      ? questionEvaluation?.amountOfAnswersTotal
      : 0) -
    (questionEvaluation?.amountOfCorrectAnswers
      ? questionEvaluation?.amountOfCorrectAnswers
      : 0);

  //the data passed into the chart of correct answers out of total answers
  const answersChartData = [
    {
      name: "Answers",
      Correct: questionEvaluation?.amountOfCorrectAnswers,
      Total: totalAnswers,
    },
  ];

  return (
    <>
      <div className="wrapperDiv">
        <div className="questionNameWrapper">
          <TextField
            size="small"
            value={currentQuestion?.name}
            inputProps={{ min: 0, style: { textAlign: "center" } }}
            fullWidth
            placeholder="Question name"
            className={classes.textField}
            disabled
          />
        </div>
        <div className="editorWrapper">
          <CustomCodeEditor
            language={
              currentQuestion
                ? currentQuestion.question.language
                : LanguageType.C
            }
            value={currentQuestion ? currentQuestion.question.value : ""}
          />
        </div>
        <div className="answersWrapper">
          {currentQuestion?.questionType === NewQuestionType.QUIZ ? (
            <AnswersEvaluation
              currentQuestion={currentQuestion}
              questionEvaluation={questionEvaluation}
            />
          ) : (
            <TrueFalseAnswersEvaluation
              isCorrect={currentQuestion?.isCorrect as boolean}
              questionEvaluation={questionEvaluation as QuestionEvaluationType}
            />
          )}
        </div>
        <div className="barWrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              stackOffset="expand"
              data={answersChartData}
              layout="vertical"
            >
              <Tooltip
                cursor={{ fill: "white" }}
                wrapperStyle={{ top: -40 }}
                content={<CustomTooltip labelFormatter={() => ""} />}
              />
              <YAxis
                dataKey={"name"}
                type="category"
                axisLine={false}
                tickLine={false}
                width={150}
              />
              <XAxis hide type="number" />
              <Bar dataKey="Correct" stackId="a" fill="#288f36" />
              <Bar dataKey="Total" stackId="a" fill="#grey" fillOpacity={0.2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="buttonWrapper">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestionButton}
            sx={{ width: "190px" }}
          >
            {lastQuestion ? "End the quiz" : "Next question"}
          </Button>
          {lastQuestion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleShowStudentResults}
              sx={{ marginTop: "20px", width: "190px" }}
            >
              Student's results
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionEvaluation;
