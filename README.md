# Angular21

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running coverage (100% minimum)

This project includes a strict coverage command that enforces 100% minimum coverage for statements, branches, functions, and lines.

```bash
npm run test:coverage
```

If the coverage drops below 100% in any metric, the command exits with an error.

Coverage reports are written to:

```text
coverage/angular-21/index.html
```

To browse the HTML report locally, run:

```bash
npm run coverage:open
```

Then open `http://localhost:4201` in your browser.

## Continuous integration

GitHub Actions runs CI on every push and pull request using:

1. Build verification via `npm run build`
2. Strict coverage verification via `npm run test:coverage`

The workflow is defined in `.github/workflows/ci.yml`.

## Running end-to-end tests

End-to-end tests are written with [Playwright](https://playwright.dev/) and live in the `e2e/` folder. The dev server starts automatically when you run the tests.

Run all e2e tests headlessly:

```bash
npm run e2e
```

Open the interactive Playwright UI (useful for debugging):

```bash
npm run e2e:ui
```

View the last HTML report in your browser:

```bash
npm run e2e:report
```

> The tests reuse a running `ng serve` instance on port 4200 if one is already active, so there is no need to start the server manually in your local workflow.

## Generated test IDs

This project uses a shared test-id generator to avoid hardcoded `data-testid` strings.

- Generator implementation: `src/app/shared/testing/test-id-generator.ts`
- Per-component ID maps: colocated `*.test-ids.ts` files beside each component/page

Create component/page IDs with the generator:

```ts
import { generateTestIds } from '../../../../shared/testing/test-id-generator';

const { scopeTestId, titleInputTestId, submitButtonTestId } = generateTestIds({
  scopeName: 'addForm',
}).add('titleInput', 'submitButton');

export const todoAddFormTestIds = {
  root: scopeTestId,
  titleInput: titleInputTestId,
  submitButton: submitButtonTestId,
} as const;
```

Use IDs in templates through bindings:

```html
<input [attr.data-testid]="testIds.titleInput" />
```

Use the same IDs in Playwright selectors:

```ts
page.getByTestId(TestId.addForm.titleInput);
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
