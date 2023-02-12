import { handleError, handleResponseWithJson } from "./apiUtils";

export function getEmailExists(email: string) {
  return fetch(
    process.env.REACT_APP_FETCH_HOST + "/betterKahoot/users/" + email,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => handleResponseWithJson(response, 200))
    .catch(handleError);
}
