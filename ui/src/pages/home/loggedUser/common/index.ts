import { Quiz } from "../../../../common/types";

//The method used to find quiz by id in current quizzes
export const findQuizById = (id: number, quizes: Quiz[]): Quiz => {
  let quizToReturn;
  quizes.forEach((quiz) => {
    if (quiz.id === id) {
      quizToReturn = quiz;
    }
  });
  return quizToReturn;
};
