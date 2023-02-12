import { Quiz } from "../common/types";
import {
  handleError,
  handleResponseWithJson,
  handleResponseWithoutJson,
} from "./apiUtils";

export function saveQuiz(variables: { bodyToSave: Quiz; userId: number }) {
  return fetch(
    process.env.REACT_APP_FETCH_HOST + "/betterKahoot/quiz/" + variables.userId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variables.bodyToSave), // body data type must match "Content-Type" header
    }
  )
    .then((response) => handleResponseWithoutJson(response, 201))
    .catch(handleError);
}

export function loadAllQuizes(id: number) {
  return fetch(process.env.REACT_APP_FETCH_HOST + "/betterKahoot/quiz/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
}

export function deleteQuiz(id: number) {
  return fetch(process.env.REACT_APP_FETCH_HOST + "/betterKahoot/quiz/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => handleResponseWithoutJson(response, 204))
    .catch(handleError);
}
