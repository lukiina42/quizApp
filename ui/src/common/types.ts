//this components defines common types, which are used across the application - while creating quiz, testing a quiz etc.

export interface QuizQuestionAnswer {
  value: string;
  isCorrect: boolean;
  //position serves also as an id
  position: string;
  key: number;
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
  answers: QuizQuestionAnswer[];
  isCorrect?: boolean;
}

//The quiz, contains array of questions and name with id
export interface Quiz {
  id: number | null;
  name: string;
  description: string;
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

const initialQuizAnswer = {
  value: "",
  isCorrect: false,
};

export const QuizQuestionPosition = {
  TOPLEFT: "topLeftAnswer",
  TOPRIGHT: "topRightAnswer",
  BOTTOMLEFT: "bottomLeftAnswer",
  BOTTOMRIGHT: "bottomRightAnswer",
};

export const initialQuizAnswers: QuizQuestionAnswer[] = [
  { ...initialQuizAnswer, position: QuizQuestionPosition.TOPLEFT, key: 0 },
  { ...initialQuizAnswer, position: QuizQuestionPosition.TOPRIGHT, key: 1 },
  { ...initialQuizAnswer, position: QuizQuestionPosition.BOTTOMLEFT, key: 2 },
  { ...initialQuizAnswer, position: QuizQuestionPosition.BOTTOMRIGHT, key: 3 },
];

//Defines user, who is currently logged in
export interface UserInterface {
  id: number;
  email: string;
  status: string;
}
