import { AbstractControl, ValidationErrors } from '@angular/forms';

export function trimmedRequiredValidator(
  control: AbstractControl<string>,
): ValidationErrors | null {
  return control.value.trim().length > 0 ? null : { trimmedRequired: true };
}
