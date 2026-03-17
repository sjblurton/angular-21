import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const {
  scopeTestId,
  checkboxTestId,
  titleTestId,
  metaTestId,
  stateButtonTestId,
  deleteButtonTestId,
} = generateTestIds({ scopeName: 'todoItem' }).add(
  'checkbox',
  'title',
  'meta',
  'stateButton',
  'deleteButton',
);

export const todoItemTestIds = {
  root: scopeTestId,
  checkbox: checkboxTestId,
  title: titleTestId,
  meta: metaTestId,
  stateButton: stateButtonTestId,
  deleteButton: deleteButtonTestId,
} as const;
