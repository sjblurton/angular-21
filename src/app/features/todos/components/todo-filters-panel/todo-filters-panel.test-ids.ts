import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const {
  scopeTestId,
  searchInputTestId,
  filterAllTestId,
  filterActiveTestId,
  filterCompletedTestId,
} = generateTestIds({ scopeName: 'filtersPanel' }).add(
  'searchInput',
  'filterAll',
  'filterActive',
  'filterCompleted',
);

export const todoFiltersPanelTestIds = {
  root: scopeTestId,
  searchInput: searchInputTestId,
  filterAll: filterAllTestId,
  filterActive: filterActiveTestId,
  filterCompleted: filterCompletedTestId,
} as const;
