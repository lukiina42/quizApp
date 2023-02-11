import { LanguageType, NewQuestionType } from "../../../common/types";

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
