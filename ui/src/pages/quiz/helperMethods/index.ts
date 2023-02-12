import {
  LanguageType,
  NewQuestionType,
  QuizAnswers,
} from "../../../common/types";
import { QuestionData, ValidationStatus } from "../types";

//TODO rename type to questionType. Not all answers are then displayed in a new question
//Creates new question with empty values
export const createNewQuizQuestion = (key: number) => {
  return {
    key: key,
    questionType: NewQuestionType.QUIZ,
    name: "",
    question: {
      value: "",
      language: LanguageType.C,
    },
    topLeftAnswer: {
      answerType: "QUIZ" as "QUIZ",
      value: "",
      isCorrect: false,
    },
    topRightAnswer: {
      answerType: "QUIZ" as "QUIZ",
      value: "",
      isCorrect: false,
    },
    bottomLeftAnswer: {
      answerType: "QUIZ" as "QUIZ",
      value: "",
      isCorrect: false,
    },
    bottomRightAnswer: {
      answerType: "QUIZ" as "QUIZ",
      value: "",
      isCorrect: false,
    },
  };
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

//validates current question
export function validateQuestionInput(
  currentQuestionData: QuestionData,
  quizAnswers: QuizAnswers
): ValidationStatus {
  let emptyAnswerValues = 0;
  if (!currentQuestionData.questionName) {
    return ValidationStatus.NAMEOFQUESTION;
  }
  //count empty answers
  Object.entries(quizAnswers).forEach(([, answer]) => {
    if (answer.value === "") {
      emptyAnswerValues += 1;
    }
  });

  if (emptyAnswerValues > 2) {
    return ValidationStatus.TWOANSWERS;
  }
  return ValidationStatus.OK;
}

export function createQuestionFromStates(
  currentQuestionData: QuestionData,
  quizAnswers: QuizAnswers
) {
  const newQuestion = {
    key: currentQuestionData.questionKey,
    questionType: currentQuestionData.questionType,
    name: currentQuestionData.questionName,
    question: {
      value: currentQuestionData.questionText,
      language: currentQuestionData.questionLanguage,
    },
    topLeftAnswer: {
      value: quizAnswers.topLeftAnswer.value,
      isCorrect: quizAnswers.topLeftAnswer.isCorrect,
    },
    topRightAnswer: {
      value: quizAnswers.topRightAnswer.value,
      isCorrect: quizAnswers.topRightAnswer.isCorrect,
    },
    bottomLeftAnswer: {
      value: quizAnswers.bottomLeftAnswer.value,
      isCorrect: quizAnswers.bottomLeftAnswer.isCorrect,
    },
    bottomRightAnswer: {
      value: quizAnswers.bottomRightAnswer.value,
      isCorrect: quizAnswers.bottomRightAnswer.isCorrect,
    },
  };
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
