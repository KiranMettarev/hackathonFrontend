import { AbstractControl, ValidationErrors } from "@angular/forms";

// Mobile Number Validator
export function mobileNumberValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const mobileRegex = /^[0-9]{10}$/;
  const valid = mobileRegex.test(control.value);
  return valid ? null : { invalidMobileNumber: true };
}

