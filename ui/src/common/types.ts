//this components defines common types, which are used across the application - while creating quiz, testing a quiz etc.

//one of the answers to the question
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
}

//defining enum like structure for language types possible in question
export enum LanguageType {
  C = "text/x-csrc",
  CPLUSPLUS = "text/x-c++src",
  JAVA = "text/x-java",
  PYTHON = "text/x-python",
  PLAINTEXT = "PLAINTEXT",
}

const initialQuizAnswer: Answer = {
  value: "",
  isCorrect: false,
};

//Defines text values of the answers
export interface QuizAnswers {
  topLeftAnswer: Answer;
  topRightAnswer: Answer;
  bottomLeftAnswer: Answer;
  bottomRightAnswer: Answer;
}

export const initialQuizAnswers = {
  topLeftAnswer: initialQuizAnswer,
  topRightAnswer: initialQuizAnswer,
  bottomLeftAnswer: initialQuizAnswer,
  bottomRightAnswer: initialQuizAnswer,
};

//Defines user, who is currently logged in
export interface UserInterface {
  id: number;
  email: string;
  status: string;
}
