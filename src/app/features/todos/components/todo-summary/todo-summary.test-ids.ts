import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const { scopeTestId, totalValueTestId, activeValueTestId, completedValueTestId } = generateTestIds({
  scopeName: 'todoSummary',
}).add('totalValue', 'activeValue', 'completedValue');

export const todoSummaryTestIds = {
  root: scopeTestId,
  totalValue: totalValueTestId,
  activeValue: activeValueTestId,
  completedValue: completedValueTestId,
} as const;
