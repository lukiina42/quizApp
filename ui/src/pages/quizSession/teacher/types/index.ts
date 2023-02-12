export interface NewStudentMessageResponse {
  name: string;
}

export interface CreateSessionMessageResponse {
  sessionId: number;
}

export interface SessionEvaluationRequest {
  sessionId: number;
}

export interface CreateSessionMessageRequest {
  quizId: number;
}

export interface NextMessageRequest {
  sessionId: number;
  questionKey: number;
}

export interface QuestionEvaluationType {
  amountOfAnswersTotal: number;
  amountOfCorrectAnswers: number;
  amountsOfPositiveAnswersToEachAnswer: {
    BOTTOMRIGHT: number;
    BOTTOMLEFT: number;
    TOPLEFT: number;
    TOPRIGHT: number;
  };
  questionKey: number;
}

//type of requests which send only the session id to the server
//those include: get evaluation of the quiz and end the session
export interface EndSessionRequest {
  sessionId: number;
  reason: string;
}

export interface StudentScoresType {
  [key: string]: number;
}

export interface StudentResultsResponse {
  studentScores: StudentScoresType;
}

export interface StudentAnsweredResponse {
  amountOfAnswers: number;
  amountOfStudents: number;
}

//The type of messages that come from the server
export const MessageType = {
  CreateSessionResponse: "CREATESESSIONRESPONSE",
  NewStudentInSession: "NEWSTUDENTINSESSION",
  QuestionEvaluation: "QUESTIONEVALUATION",
  StudentResults: "STUDENTRESULTS",
  StudentAnswered: "STUDENTANSWERED",
};

//Enum like structure defining which layout should be currently displayed
export const LayoutType = {
  UsersJoining: "UsersJoining",
  DisplayQuestion: "DisplayQuestion",
  ShowEvaluation: "ShowEvaluation",
  StudentScores: "StudentScores",
};

//The reasons why the end session request is sent to the server.
//If it is unexpected page leave, then the session is deleted, saved otherwise.
export const EndSessionReason = {
  PAGELEAVE: "PAGELEAVE",
  ENDOFQUIZ: "ENDOFQUIZ",
};
