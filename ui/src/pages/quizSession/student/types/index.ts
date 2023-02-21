import { QuizQuestionAnswer, Quiz } from "../../../../common/types";

export interface ResponseMessage {
  responseType: string;
}

export interface JoinSessionResponse extends ResponseMessage {
  quiz: Quiz;
  responseStatus: string;
}

export interface NextQuestionMessage extends ResponseMessage {
  questionKey: number;
}

export interface ResultMessage extends ResponseMessage {
  correctAnswers: number;
}

//When student answers, the data are sent in this format to the server
export interface QuestionAnswer {
  sessionId: number;
  questionKey: number;
  answers: QuizQuestionAnswer[];
}

//Response status to join session request
export const responseStatus = {
  CONNECTED: "CONNECTED",
  SESSIONNOTFOUND: "NOTFOUND",
  NAMEEXISTS: "NAMEEXISTS",
};

//Response types, used to determine which type of message came from the server
export const responseType = {
  JOINSESSION: "JOINSESSION",
  NEXTQUESTION: "NEXTQUESTION",
  ENDSESSION: "ENDSESSION",
  SENDRESULT: "SENDRESULT",
  QUESTIONEND: "QUESTIONEND",
};

//Layout type, user is either joining quiz with the form, waiting for teacher's action or answering a question
export const LayoutType = {
  JoiningQuiz: "JoiningQuiz",
  WaitingForTeacher: "WaitingForTeacher",
  AnsweringQuestion: "AnsweringQuestion",
};
