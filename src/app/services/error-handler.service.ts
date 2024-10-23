import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor() {}
  private errorMappings = new Map([
    [404, "Your Email Id is not exists. Please verify and re-enter email."],
    [400, "Your Email or Password is incorrect. Please try again."],
    [0, "Server not running"],
    // Add more mappings as needed
  ]);
  handleAuthError(error: unknown): HttpErrorResponse | ErrorResponse {
    let err = error;
    if (error instanceof HttpErrorResponse) {
      const defaultErrorMessage = error.message
        ? error.message
        : "Unknown error";

      const errorMessage =
        this.errorMappings.get(error.status) || defaultErrorMessage;

      err = {
        error: {
          message: "Bad Request",
          data: [
            {
              message: errorMessage,
              path: [""],
            },
          ],
        },
      };
    }
    return err as HttpErrorResponse | ErrorResponse;
  }

  handleOtpError(error: unknown): HttpErrorResponse | ErrorResponse {
  let err = error;
  if (error instanceof HttpErrorResponse) {
    const defaultErrorMessage = error.message
      ? error.message
      : "Unable to generate OTP. Please try again.";

    // You can define specific OTP-related error messages here, similar to your errorMappings
    const otpErrorMessage = this.errorMappings.get(error.status) || defaultErrorMessage;

    err = {
      error: {
        message: "OTP Request Failed",
        data: [
          {
            message: otpErrorMessage, // The specific message for OTP errors
            path: [""],
          },
        ],
      },
    };
  }
  return err as HttpErrorResponse | ErrorResponse;
}

}
export type ErrorResponse = {
  error: { message: string; data: ErrorData[] };
};
export type ErrorData = {
  message: string;
  path: string[];
};
