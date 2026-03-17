import { generateTestIds } from '../../shared/testing/test-id-generator';

const { scopeTestId, resultsSummaryTestId, resetViewButtonTestId } = generateTestIds({
  scopeName: 'todosPage',
}).add('resultsSummary', 'resetViewButton');

export const todosPageTestIds = {
  root: scopeTestId,
  resultsSummary: resultsSummaryTestId,
  resetViewButton: resetViewButtonTestId,
} as const;
