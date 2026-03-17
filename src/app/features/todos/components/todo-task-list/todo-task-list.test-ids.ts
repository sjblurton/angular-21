import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const { scopeTestId, emptyHeadingTestId } = generateTestIds({
  scopeName: 'taskList',
}).add('emptyHeading');

export const todoTaskListTestIds = {
  root: scopeTestId,
  emptyHeading: emptyHeadingTestId,
} as const;
