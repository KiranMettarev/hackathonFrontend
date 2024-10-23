import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup, ValidationErrors } from "@angular/forms";

export type ErrorType = Array<{
  path: string[];
  message: string;
}>;

const errorCodes = [
  { code: 400, message: "Bad Request" },
  { code: 401, message: "Invalid authorization credentials" },
  { code: 403, message: "Action prohibited" },
  { code: 404, message: "Resource not found" },
  { code: 422, message: "Unprocessable Entity" },
  { code: 429, message: "Too Many Requests" },
  { code: 500, message: "Internal Server Error" },
];

function getErrorMessageForStatusCode(status: number): string {
  const error = errorCodes.find((err) => err.code === status);
  return error ? error.message : "Unknown error code";
}

export class FormErrorHandler {
  private static errorMessages: { [key: string]: string } = {};

  static handleServerErrors(
    errorResponse: HttpErrorResponse | null,
    form: FormGroup,
    manualError: { key: string; message: string } | null = null,
  ): { [key: string]: string } {
    const errors = (errorResponse?.error?.data || []) as ErrorType;
    const formLevelErrors: string[] = [];

    // If there's a manual error, add it directly
    // Check for manual errors first
    if (manualError) {
      // Set manual error directly in the form
      form.setErrors({ serverError: manualError.message });
      formLevelErrors.push(manualError.message);
    } else if (errorResponse) {
      // Only process error response if manual error is not present
      const statusErrorMessage = getErrorMessageForStatusCode(
        errorResponse.status,
      );
      if (statusErrorMessage) {
        formLevelErrors.push(statusErrorMessage);
      }

      // Process server errors
      errors.forEach(({ path, message }) => {
        if (path.length === 0) {
          // General form error
          formLevelErrors.push(message);
        } else {
          // Field-specific error
          const controlName = path[0];
          const control = form.get(controlName);
          if (control) control.setErrors({ serverError: message });
        }
      });
    }

    if (formLevelErrors.length > 0) {
      form.setErrors({ serverError: formLevelErrors.join(" ") });
    }

    if (errors.length > 0 || formLevelErrors.length > 0 || manualError)
      return this.updateErrorMessage(form, errors);
    return {};
  }

  static updateErrorMessage(
    form: FormGroup,
    _errors: ErrorType,
  ): { [key: string]: string } {
    Object.entries(form.controls).forEach(([controlName, control]) => {
      this.errorMessages[controlName] = this.getErrorMessage(
        controlName,
        control.errors,
      );
    });

    // Handle form-level errors
    if (form.errors && form.errors["serverError"]) {
      this.errorMessages["form"] = form.errors["serverError"];
    }

    return this.errorMessages;
  }

  private static getErrorMessage(
    controlName: string,
    errors: ValidationErrors | null,
  ): string {
    if (!errors) return "";
    if (errors["required"])
      return this.formatErrorMessage(controlName, "is required");
    if (errors["pattern"]) return this.getPatternErrorMessage(controlName);
    if (errors["minlength"])
      return this.formatErrorMessage(controlName, "Min length is 7 digits");
    if (errors["maxlength"])
      return this.formatErrorMessage(controlName, "Max length is 13 digits");
    if (errors["serverError"])
      return this.capitalizeFirstLetter(
        errors["serverError"].replace(/["]/g, ""),
      );
    return "";
  }

  private static formatErrorMessage(
    controlName: string,
    message: string,
  ): string {
    return `${this.capitalizeWords(controlName)} ${message}`;
  }

  private static getPatternErrorMessage(controlName: string): string {
    switch (controlName) {
      case "contactNumber":
        return "Must contain only digits";
      case "email":
        return "Please enter a valid email";
      case "password":
        return "Must contain at least one uppercase letter, one lowercase letter, one digit";
      default:
        return "";
    }
  }

  private static capitalizeWords(controlName: string): string {
    return controlName
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .trim();
  }

  private static capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
