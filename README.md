# Angular21

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Linting and type checking

Run ESLint across the workspace:

```bash
npm run lint
```

Apply auto-fixable ESLint changes:

```bash
npm run lint:fix
```

Run TypeScript checks for the application and unit-test projects:

```bash
npm run type-check
```

Run the main local quality gate used before pushing changes:

```bash
npm run validate
```

Commits also run `lint-staged` through Husky. Any staged `*.ts` files are processed with:

```bash
eslint --fix
prettier --write
```

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

GitHub Actions is split across three workflows:

1. `.github/workflows/lint-and-typecheck.yml`
   Runs `npm run lint` and `npm run type-check`.
2. `.github/workflows/tests.yml`
   Runs `npm run build`, `npm run test:coverage`, and `npm run e2e`.
3. `.github/workflows/vrt.yml`
   Builds Storybook, generates candidate visual-regression snapshots, and uploads review artifacts for pull requests.

The shared dependency bootstrap logic lives in `.github/actions/setup-ci/action.yml`.

## Running end-to-end tests

End-to-end tests are written with [Playwright](https://playwright.dev/) and live in the `e2e/` folder.

Start the Angular dev server in one terminal first:

```bash
npm run start
```

Then run e2e commands from a second terminal.

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

> The e2e tests expect the app to be available at `http://localhost:4200`. If the dev server is not running, Playwright will fail with connection errors.

## Running Storybook

This project includes [Storybook](https://storybook.js.org/) for isolated UI development and documentation.

Start Storybook locally:

```bash
npm run storybook
```

`npm run storybook` refreshes reports first by running:

```bash
npm run reports:refresh
```

This regenerates both coverage and Playwright HTML reports before launching Storybook.

By default, Storybook is served at `http://localhost:6006`.

Build a static Storybook site:

```bash
npm run build-storybook
```

`npm run build-storybook` also runs `npm run reports:refresh` first.

Static output is written to:

```text
storybook-static/
```

Story files live under `src/**/*.stories.ts`.

Todo component stories are grouped under the Storybook title prefix `Todos/Components`.

### Storybook Reports section

Storybook includes a **Reports** section with embedded HTML reports:

- **Coverage** → `coverage/angular-21/index.html`
- **Playwright** → `playwright-report/index.html`

To regenerate both reports manually without launching/building Storybook:

```bash
npm run reports:refresh
```

## Visual regression testing for Storybook

Visual regression tests use Playwright against the static Storybook build.

Run the current visual regression suite:

```bash
npm run e2e:vrt
```

Update approved snapshots after an intentional UI change:

```bash
npm run e2e:vrt:update
```

Open the Playwright UI in VRT mode:

```bash
npm run e2e:vrt:ui
```

Snapshot baselines are stored in:

```text
snapshots/vrt/stories.spec.ts/
```

The VRT runner automatically discovers Todo component stories from source files. A story is included automatically when:

1. It lives in a `src/**/*.stories.ts` file.
2. Its Storybook `title` starts with `Todos/Components`.
3. It is exported using the `Story` alias pattern, for example `export const Default: Story = { ... }`.

The Playwright VRT server also verifies that `storybook-static/index.html` and `storybook-static/iframe.html` exist before serving. If the static build is missing or incomplete, it rebuilds Storybook automatically.

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
