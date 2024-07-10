// httpStatusCodes.ts

export type HttpStatusCode = 200 | 201 | 202 | 204 | 301 | 304 | 400 | 401 | 403 | 404 | 409 | 413 | 416 | 429 | 500 | 501 | 503 | 504;

const statusMessages: { [key in HttpStatusCode]: string } = {
  200: "OK: Success!",
  201: "Created: The requested resource has been created successfully.",
  202: "Accepted: The requested change has been accepted for processing but has not been completed.",
  204: "No Content: The server has successfully fulfilled the request and there is no additional content to send in the response payload body.",
  301: "Moved Permanently: The URL of the requested resource has been changed permanently.",
  304: "Not Modified: There was no new data to return.",
  400: "Bad Request: The request was invalid or cannot be otherwise served.",
  401: "Unauthorized: Missing or incorrect authentication credentials.",
  403: "Forbidden: The request is understood, but it has been refused, or access is not allowed.",
  404: "Not Found: The URI requested is invalid or the resource requested does not exist.",
  409: "Conflict: The data submitted was invalid, please check again before submitting.",
  413: "Payload Too Large: The request entity is larger than limits defined by server.",
  416: "Invalid Range: Invalid value in the range or content-range headers.",
  429: "Too Many Requests: The application's rate limit has been exhausted for the resource.",
  500: "Internal Server Error: Something is broken. Contact support or raise a GitHub issue.",
  501: "Not Implemented: The feature is not implemented.",
  503: "Service Unavailable: The servers are up but overloaded with requests. Try again later.",
  504: "Gateway Timeout: The servers are up, but the request couldn't be serviced due to some failure within the stack. Try again later."
};

export const getStatusMessage = (statusCode: HttpStatusCode): string => {
  return statusMessages[statusCode] || "Something went wrong with your request, please try again later";
};
