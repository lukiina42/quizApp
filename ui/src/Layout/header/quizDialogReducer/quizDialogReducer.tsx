interface QuizDialog {
  open: boolean;
  quizName: string;
  quizDescription: string;
  quizNameError: boolean;
}

export const actionTypes = {
  OPEN: "open",
  CLOSE: "close",
  INPUTCHANGE: "inputChange",
};

export default function quizDialogReducer(
  currentDialog: QuizDialog,
  action
): QuizDialog {
  switch (action.type) {
    case actionTypes.OPEN: {
      return {
        ...currentDialog,
        open: true,
      };
    }
    case actionTypes.CLOSE: {
      return {
        ...currentDialog,
        open: false,
      };
    }
    case actionTypes.INPUTCHANGE: {
      return {
        ...currentDialog,
        [action.event.target.name]: action.event.target.value,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
