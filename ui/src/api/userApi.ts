import { handleError, handleResponseWithJson } from "./apiUtils";

export function getEmailExists(query) {
  const email = query.queryKey[1].email;
  if (!email) return false;
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

export function registerUser(dataToSend) {
  return fetch(process.env.REACT_APP_FETCH_HOST + "/betterKahoot/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend), // body data type must match "Content-Type" header
  })
    .then((response) => handleResponseWithJson(response, 201))
    .catch(handleError);
}
