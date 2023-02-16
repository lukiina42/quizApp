import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./features/currentQuizSlice";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});
