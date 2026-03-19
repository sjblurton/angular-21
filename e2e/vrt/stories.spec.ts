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

          const renderStateHandle = await page.waitForFunction(
            () => {
              const body = document.body;
              if (!body) {
                return null;
              }

              if (body.classList.contains('sb-show-main')) {
                return 'ready';
              }

              if (body.classList.contains('sb-show-nopreview')) {
                return 'no-preview';
              }

              if (body.classList.contains('sb-show-errordisplay')) {
                const storybookError = document.querySelector('#error-message')?.textContent ?? '';
                return storybookError.trim().length > 0
                  ? `storybook-error:${storybookError.trim()}`
                  : 'storybook-error';
              }

              if (body.children.length === 0 && body.textContent?.trim() === 'Not Found') {
                return 'not-found';
              }

              return null;
            },
            { timeout: 12_000 },
          );

          const renderState = (await renderStateHandle.jsonValue()) as string;
          if (renderState !== 'ready') {
            throw new Error(`Story did not render for ${path}. Render state: ${renderState}`);
          }

          await expect(page).toHaveScreenshot({
            fullPage: false,
            animations: 'disabled',
            maxDiffPixels: 50,
          });
        });
      }
    });
  }
});
