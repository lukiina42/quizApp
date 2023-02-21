import {
  QuizQuestionAnswer,
  initialQuizAnswers,
  LanguageType,
  NewQuestionType,
  Question,
} from "../../../common/types";
import { QuestionData, ValidationStatus } from "../types";

//TODO rename type to questionType. Not all answers are then displayed in a new question
//Creates new question with empty values
export const createNewQuestion = (
  key: number,
  type: NewQuestionType
): Question => {
  switch (type) {
    case NewQuestionType.QUIZ:
      return {
        key: key,
        questionType: NewQuestionType.QUIZ,
        name: "",
        question: {
          value: "",
          language: LanguageType.C,
        },
        answers: initialQuizAnswers,
      };
    case NewQuestionType.TRUEFALSE:
      return {
        key: key,
        questionType: NewQuestionType.TRUEFALSE,
        name: "",
        question: {
          value: "",
          language: LanguageType.C,
        },
        isCorrect: true,
        answers: [],
      };
  }
};

//Counts amount of enters in the text, used in answer text field
export function countBreakLines(text: string): number {
  let breakLines = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      breakLines++;
    }
  }
  return breakLines;
}

const validateQuizQuestionAnswers = (
  quizAnswers: QuizQuestionAnswer[]
): ValidationStatus => {
  let emptyAnswerValues = 0;
  //count empty answers
  Object.entries(quizAnswers as QuizQuestionAnswer[]).forEach(([, answer]) => {
    if (answer.value === "") {
      emptyAnswerValues += 1;
    }
  });

  if (emptyAnswerValues > 2) {
    return ValidationStatus.TWOANSWERS;
  }
  return ValidationStatus.OK;
};

//validates current question
export function validateQuestionInput(
  currentQuestionData: QuestionData,
  quizAnswers?: QuizQuestionAnswer[]
): ValidationStatus {
  if (!currentQuestionData.questionName) {
    return ValidationStatus.NAMEOFQUESTION;
  }
  if (currentQuestionData.questionType === NewQuestionType.QUIZ) {
    return validateQuizQuestionAnswers(quizAnswers!);
  }
  return ValidationStatus.OK;
}

export function createQuestionFromStates(
  currentQuestionData: QuestionData,
  answers: QuizQuestionAnswer[]
) {
  let questionMetadata = {
    key: currentQuestionData.questionKey,
    questionType: currentQuestionData.questionType,
    name: currentQuestionData.questionName,
  };
  let newQuestion = {};
  if (currentQuestionData.questionType === NewQuestionType.QUIZ) {
    newQuestion = {
      ...questionMetadata,
      question: {
        value: currentQuestionData.questionText,
        language: currentQuestionData.questionLanguage,
      },
      answers,
    };
  } else if (currentQuestionData.questionType === NewQuestionType.TRUEFALSE) {
    newQuestion = {
      ...questionMetadata,
      question: {
        value: currentQuestionData.questionText,
        language: currentQuestionData.questionLanguage,
      },
      isCorrect: currentQuestionData.questionIsCorrect,
    };
  }
  return newQuestion;
}

//default settings of the notifications, stored in const to prevent code repeating, using spred operator instead
export const toastSettings = {
  position: "top-right" as const,
  autoClose: 7000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const sortQuizAnswers = (answers: QuizQuestionAnswer[]) => {
  return answers.sort((a, b) => -(a.key - b.key));
};
