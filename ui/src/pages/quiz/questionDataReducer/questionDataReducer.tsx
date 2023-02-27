import { NewQuestionType } from "../../../common/types";
import { QuestionData } from "../types";

export const actionTypes = {
  LANGUAGECHANGE: "LANGUAGECHANGE",
  QUESTIONTEXTCHANGE: "QUESTIONTEXTCHANGE",
  QUESTIONNAMECHANGE: "QUESTIONNAMECHANGE",
  ISCORRECTTOGGLE: "ISCORRECTTOGGLE",
  LOADNEXTQUESTION: "LOADNEXTQUESTION",
  LOADNEWQUESTION: "LOADNEWQUESTION",
  DECREASEQUESTIONKEY: "DECREASEQUESTIONKEY",
};

export default function questionDataReducer(
  currentQuestionData: QuestionData,
  action
): QuestionData {
  switch (action.type) {
    case actionTypes.LANGUAGECHANGE: {
      return { ...currentQuestionData, questionLanguage: action.language };
    }
    case actionTypes.QUESTIONTEXTCHANGE: {
      return { ...currentQuestionData, questionText: action.text };
    }
    case actionTypes.QUESTIONNAMECHANGE: {
      return { ...currentQuestionData, questionName: action.questionName };
    }
    case actionTypes.ISCORRECTTOGGLE: {
      return {
        ...currentQuestionData,
        questionIsCorrect: !currentQuestionData.questionIsCorrect,
      };
    }
    case actionTypes.LOADNEXTQUESTION: {
      const nextQuestion = action.nextQuestion;
      return {
        ...currentQuestionData,
        questionKey: nextQuestion.key,
        questionName: nextQuestion.name,
        questionText: nextQuestion.question.value,
        questionLanguage: nextQuestion.question.language,
        questionType: nextQuestion.questionType,
        questionIsCorrect:
          nextQuestion.questionType === NewQuestionType.TRUEFALSE
            ? nextQuestion.isCorrect!
            : false,
      };
    }
    case actionTypes.LOADNEWQUESTION: {
      const nextQuestion = action.newQuestion;
      return {
        ...currentQuestionData,
        questionKey: nextQuestion.key,
        questionName: nextQuestion.name,
        questionText: nextQuestion.question.value,
        questionLanguage: nextQuestion.question.language,
        questionType: nextQuestion.questionType,
        questionIsCorrect:
          nextQuestion.questionType === NewQuestionType.QUIZ ? false : true,
      };
    }
    case actionTypes.DECREASEQUESTIONKEY: {
      return {
        ...currentQuestionData,
        questionKey: currentQuestionData.questionKey - 1,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
