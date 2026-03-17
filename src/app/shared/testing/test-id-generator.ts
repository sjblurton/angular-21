type GeneratedElementTestIds<ElementNames extends readonly string[]> = {
  readonly [K in ElementNames[number] as `${K}TestId`]: string;
};

const camelCaseBoundaryPattern = /([a-z0-9])([A-Z])/g;
const separatorPattern = /[\s_]+/g;

function toKebabCase(value: string): string {
  return value
    .replace(camelCaseBoundaryPattern, '$1-$2')
    .replace(separatorPattern, '-')
    .toLowerCase();
}

/**
 * Creates a scoped test-id builder for generating stable `data-testid` values.
 *
 * Generated values follow this convention:
 * - `scopeTestId`: `scope-name`
 * - `${elementName}TestId`: `scope-name--element-name`
 *
 * Scope and element names are normalized to kebab-case, so camelCase,
 * PascalCase, snake_case, and spaced words produce consistent IDs.
 *
 * @typeParam ScopeName String literal type of the logical component/page scope.
 * @param options Configuration object.
 * @param options.scopeName Scope name used as the `data-testid` prefix.
 * @returns Builder with an `add(...elementNames)` method for generating IDs.
 *
 * @example
 * const { scopeTestId, titleInputTestId, submitButtonTestId } =
 *   generateTestIds({ scopeName: 'addForm' }).add(
 *     'titleInput',
 *     'submitButton',
 *   );
 *
 * // scopeTestId -> "add-form"
 * // titleInputTestId -> "add-form--title-input"
 * // submitButtonTestId -> "add-form--submit-button"
 */
export function generateTestIds<const ScopeName extends string>({
  scopeName,
}: {
  scopeName: ScopeName;
}) {
  const scopedPrefix = toKebabCase(scopeName);

  return {
    add<const ElementNames extends readonly string[]>(...elementNames: ElementNames) {
      const generatedIds: Record<string, string> = {
        scopeTestId: scopedPrefix,
      };

      for (const elementName of elementNames) {
        generatedIds[`${elementName}TestId`] = `${scopedPrefix}--${toKebabCase(elementName)}`;
      }

      return Object.freeze(generatedIds) as {
        readonly scopeTestId: string;
      } & GeneratedElementTestIds<ElementNames>;
    },
  };
}
