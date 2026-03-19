import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularEslintTemplateParser from '@angular-eslint/template-parser';


export default [
  {
    ignores: ['node_modules', 'dist', 'coverage', '.angular', 'storybook-static'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    ...tseslint.configs.recommended[0],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        expect: 'readonly',
      },
    },
  },
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularEslintTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularEslintTemplatePlugin,
    },
    rules: {
      '@angular-eslint/template/use-track-by-function': 'warn',
    },
  },
];
