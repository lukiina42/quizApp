import { createSlice } from "@reduxjs/toolkit";
import { mergeSort } from "../../pages/helperMethods";

const initialState = {};

const currentQuizSlice = createSlice({
  name: "currentQuiz",
  initialState,
  reducers: {
    // Give case reducers meaningful past-tense "event"-style names
    quizChanged(state, action) {
      const quiz = action.payload;
      let sortedQuestions = mergeSort([...quiz.questions]);
      state = {
        ...quiz,
        questions: sortedQuestions,
      };
      return state;
    },
  },
});

// `createSlice` automatically generated action creators with these names.
// export them as named exports from this "slice" file
export const { quizChanged } = currentQuizSlice.actions;

// Export the slice reducer as the default export
export default currentQuizSlice.reducer;
