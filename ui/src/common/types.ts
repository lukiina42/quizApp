//this components defines common types, which are used across the application - while creating quiz, testing a quiz etc.

//One of the answers to the quiz question
interface Answer {
  value: string;
  isCorrect: boolean;
}

//The question in the quiz
export interface Question {
  key: number;
  questionType: string;
  name: string;
  question: {
    value: string;
    language: LanguageType;
  };
  topLeftAnswer: Answer;
  topRightAnswer: Answer;
  bottomLeftAnswer: Answer;
  bottomRightAnswer: Answer;
}

//The quiz, contains array of questions and name with id
export interface Quiz {
  id: number;
  name: string;
  questions: Array<Question>;
}

//defining enum like structure for question types
export enum NewQuestionType {
  QUIZ = "QUIZ",
  TRUEFALSE = "TRUEFALSE",
};

//defining enum like structure for language types possible in question
export enum LanguageType {
  C = "text/x-csrc",
  CPLUSPLUS = "text/x-c++src",
  JAVA = "text/x-java",
  PYTHON = "text/x-python",
  PLAINTEXT = "PLAINTEXT",
};

//Initial state of the answers true/false parameter.
//The user can change those values while creating quiz or while answering to the question in the session
export const answersCorrectInitialState = {
  TopLeft: false,
  TopRight: false,
  BottomRight: false,
  BottomLeft: false,
};

//This interface is used in useState hook multiple times,
//for example when teacher is creating a question - the information
//whether the answer is marked as correct is saved in this interface
export interface AnswersCorrect {
  TopLeft: boolean;
  TopRight: boolean;
  BottomRight: boolean;
  BottomLeft: boolean;
}

//Defines text values of the answers
export interface AnswerValues {
  topLeftAnswer: string;
  topRightAnswer: string;
  bottomLeftAnswer: string;
  bottomRightAnswer: string;
}

//Defines user, who is currently logged in
export interface UserInterface {
  id: number;
  email: string;
  status: string;
}

export enum ValidationStatus{
  OK = "OK",
  TWOANSWERS = "At least 2 answers should be filled",
  NAMEOFQUESTION = "Name of the question is required"
}
