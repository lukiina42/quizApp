import { Question } from "../../common/types";

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
