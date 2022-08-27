import React from "react";
import MaterialTable from "material-table";
import "./index.css";
import { Button } from "@mui/material";

import { StudentScoresType } from "../StartQuiz";

interface StudentResultsProps {
  studentScores: StudentScoresType | null;
  handleNextQuestionButton: () => void;
}

interface StudentInTable {
  position: number;
  name: string;
  score: number;
}

//creates an array of top 3 students
const getTopThree = (
  studentScores: StudentScoresType
): Array<StudentInTable> => {
  if (studentScores === null) {
    return [];
  }
  let studentArray: Array<StudentInTable> = [];
  let position = 1;

  const studentScoresAmount = Object.keys(studentScores).length;

  for (
    let i = 0;
    i <= (studentScoresAmount > 3 ? 2 : studentScoresAmount);
    i++
  ) {
    let mostSuccessfulStudent: StudentInTable | null = null;
    for (const [key, value] of Object.entries(studentScores)) {
      if (mostSuccessfulStudent === null) {
        mostSuccessfulStudent = { position: position, name: key, score: value };
      } else if (mostSuccessfulStudent.score <= value) {
        mostSuccessfulStudent = { position: position, name: key, score: value };
      }
    }
    if (mostSuccessfulStudent !== null) {
      studentArray.push(mostSuccessfulStudent);
      delete studentScores[mostSuccessfulStudent.name];
    }
    position++;
  }
  return studentArray;
};

//Displays top 3 students of the session
const StudentResults = (props: StudentResultsProps) => {
  const tableScores = getTopThree(
    props.studentScores ? props.studentScores : {}
  );

  return (
    <>
      <div className="studentResultsWrapper">
        <div className="tableWrapper">
          <MaterialTable
            options={{
              search: false,
              paging: false,
            }}
            columns={[
              { title: "Position", field: "position" },
              { title: "Student", field: "name" },
              { title: "Score", field: "score" },
            ]}
            data={tableScores}
            title="Student's scores"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={props.handleNextQuestionButton}
        >
          End the quiz
        </Button>
      </div>
    </>
  );
};

export default StudentResults;
