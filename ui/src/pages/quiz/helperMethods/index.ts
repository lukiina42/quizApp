import { LanguageType, NewQuestionType, Question } from "../../../common/types";

//Helper method for merge sort, merges 2 arrays
function merge(left: Question[], right: Question[]): Question[] {
  let sortedArr: Question[] = []; // the sorted elements will go here

  while (left.length && right.length) {
    // insert the smallest element to the sortedArr
    if (left[0].key < right[0].key) {
      //Considering the condition zero index of the arrays cannot be undefined so this ts error can be ignored
      //@ts-ignore: Type 'undefined' is not assignable to type 'never'
      sortedArr.push(left.shift());
    } else {
      //@ts-ignore: Type 'undefined' is not assignable to type 'never'
      sortedArr.push(right.shift());
    }
  }

  // use spread operator and create a new array, combining the three arrays
  return [...sortedArr, ...left, ...right];
}

//Merge sort to sort the questions in quiz
export function mergeSort(arr: Question[]): Question[] {
  const half: number = arr.length / 2;

  // the base case is array length <=1
  if (arr.length <= 1) {
    return arr;
  }

  const left = arr.splice(0, half); // the first half of the array
  const right = arr;
  return merge(mergeSort(left), mergeSort(right));
}

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
