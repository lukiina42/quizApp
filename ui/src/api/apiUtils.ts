export async function handleResponseWithJson(
  response,
  expectedSuccessCode: number
) {
  if (response.status === expectedSuccessCode) return response.json();
  if (response.status !== expectedSuccessCode) {
    // So, a server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

export async function handleResponseWithoutJson(
  response,
  expectedSuccessCode: number
) {
  if (response.status === expectedSuccessCode) return response.text();
  if (response.status !== expectedSuccessCode) {
    // So, a server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

// In a real app, would likely call an error logging service.
export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}
