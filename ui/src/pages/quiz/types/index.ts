import { LanguageType } from "../../../common/types";

export enum ValidationStatus {
  OK = "OK",
  TWOANSWERS = "At least 2 answers should be filled",
  NAMEOFQUESTION = "Name of the question is required",
}

export interface QuestionData {
  questionKey: number;
  questionName: string;
  questionText: string;
  questionLanguage: LanguageType;
  questionType: string;
}
