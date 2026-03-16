import { FormControl } from '@angular/forms';

import { trimmedRequiredValidator } from './trimmed-required.validator';

describe('trimmedRequiredValidator', () => {
  it('should return null for a non-empty string', () => {
    const control = new FormControl('hello', { nonNullable: true });
    expect(trimmedRequiredValidator(control)).toBeNull();
  });

  it('should return an error for an empty string', () => {
    const control = new FormControl('', { nonNullable: true });
    expect(trimmedRequiredValidator(control)).toEqual({ trimmedRequired: true });
  });

  it('should return an error for a whitespace-only string', () => {
    const control = new FormControl('   ', { nonNullable: true });
    expect(trimmedRequiredValidator(control)).toEqual({ trimmedRequired: true });
  });
});
