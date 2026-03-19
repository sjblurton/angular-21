import type { StorybookConfig } from '@storybook/angular';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDirs: StorybookConfig['staticDirs'] = [];

// Only include report directories if they exist (they won't in fresh CI builds)
const coverageDir = resolve(__dirname, '../coverage/angular-21');
if (existsSync(coverageDir)) {
  staticDirs.push({
    from: '../coverage/angular-21',
    to: '/reports/coverage',
  });
}

const playwrightDir = resolve(__dirname, '../playwright-report');
if (existsSync(playwrightDir)) {
  staticDirs.push({
    from: '../playwright-report',
    to: '/reports/playwright',
  });
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs,
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-onboarding'],
  framework: '@storybook/angular',
};
export default config;
