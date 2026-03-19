/// <reference types="node" />

import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for Storybook Stories
 *
 * These tests capture snapshots of component stories across multiple viewports
 * to detect unintended visual changes. Tests run against the static Storybook build.
 *
 * Run with: npm run e2e:vrt
 * Update snapshots: npm run e2e:vrt:update
 */

const viewports = [
  {
    name: 'mobile',
    width: 375,
    height: 667,
  },
  {
    name: 'tablet',
    width: 768,
    height: 1024,
  },
  {
    name: 'desktop',
    width: 1280,
    height: 720,
  },
];

function getStoryPath(componentPath: string, storyName: string): string {
  const kebabCaseStory = storyName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const id = `${componentPath}--${kebabCaseStory}`;
  return `/iframe.html?viewMode=story&id=${id}`;
}

test.describe('TodoAddForm Component Stories', () => {
  const stories = [
    { storyName: 'Empty', description: 'Default empty state' },
    { storyName: 'Filled', description: 'With content' },
    { storyName: 'RequiredError', description: 'Validation error for empty/whitespace' },
    { storyName: 'MaxLengthError', description: 'Validation error for length exceeded' },
  ];

  for (const viewport of viewports) {
    test.describe(`@${viewport.name}`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      for (const story of stories) {
        test(`${story.storyName} - ${story.description}`, async ({ page }) => {
          const path = getStoryPath('todos-components-todo-add-form', story.storyName);
          await page.goto(path);

          await page.waitForLoadState('domcontentloaded');

          await page.waitForSelector('#storybook-root > *', { state: 'visible' });

          await expect(page).toHaveScreenshot(
            `todo-add-form-${story.storyName.toLowerCase()}-${viewport.name}.png`,
            {
              fullPage: false,
              animations: 'disabled',
              maxDiffPixels: 50,
            },
          );
        });
      }
    });
  }
});
