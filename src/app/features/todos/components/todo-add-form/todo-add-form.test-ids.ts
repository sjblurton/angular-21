import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const { scopeTestId, titleInputTestId, submitButtonTestId, errorRequiredTestId } = generateTestIds({
  scopeName: 'addForm',
}).add('titleInput', 'submitButton', 'errorRequired');

export const todoAddFormTestIds = {
  root: scopeTestId,
  titleInput: titleInputTestId,
  submitButton: submitButtonTestId,
  errorRequired: errorRequiredTestId,
} as const;

export type TodoAddFormTestIds = typeof todoAddFormTestIds;
