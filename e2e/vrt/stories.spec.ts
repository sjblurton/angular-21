import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';

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

interface StoryDefinition {
  exportName: string;
  id: string;
  title?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storyTitlePrefix = 'Todos/Components';
const storiesSourceRoot = resolve(__dirname, '../../src');

function getStoryPath(storyId: string): string {
  return `/iframe.html?viewMode=story&id=${storyId}`;
}

function collectStoryFiles(directoryPath: string): string[] {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directoryPath, entry.name);

    if (entry.isDirectory()) {
      return collectStoryFiles(entryPath);
    }

    return entry.name.endsWith('.stories.ts') ? [entryPath] : [];
  });
}

function toStorySegment(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

function formatStoryName(exportName: string): string {
  return exportName.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

function parseStoriesFromFile(filePath: string): StoryDefinition[] {
  const source = readFileSync(filePath, 'utf8');
  const titleMatch = source.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const title = titleMatch?.[1];

  if (!title?.startsWith(storyTitlePrefix)) {
    return [];
  }

  const titleId = title
    .split('/')
    .map((segment) => toStorySegment(segment))
    .join('-');

  return Array.from(source.matchAll(/export const\s+(\w+)\s*:\s*Story\b/g), (match) => ({
    exportName: match[1],
    id: `${titleId}--${toStorySegment(match[1])}`,
    title,
  }));
}

function discoverStoriesFromSource(): StoryDefinition[] {
  const stories = collectStoryFiles(storiesSourceRoot)
    .flatMap((filePath) => parseStoriesFromFile(filePath))
    .sort((a, b) => {
      const titleCompare = (a.title ?? '').localeCompare(b.title ?? '');
      if (titleCompare !== 0) {
        return titleCompare;
      }

      return a.exportName.localeCompare(b.exportName);
    });

  if (stories.length === 0) {
    throw new Error(
      `No stories found for title prefix "${storyTitlePrefix}". Check Storybook story titles or story export patterns.`
    );
  }

  return stories;
}

const stories = discoverStoriesFromSource();

async function waitForStoryToRender(page: Page, path: string): Promise<void> {
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
    { timeout: 12_000 }
  );

  const renderState = (await renderStateHandle.jsonValue()) as string;
  if (renderState !== 'ready') {
    throw new Error(`Story did not render for ${path}. Render state: ${renderState}`);
  }
}

test.describe('Todo Component Stories', () => {
  for (const viewport of viewports) {
    test.describe(`@${viewport.name}`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
      });

      for (const story of stories) {
        test(`${story.title ?? 'Unknown'} / ${formatStoryName(story.exportName)}`, async ({
          page,
        }) => {
          const path = getStoryPath(story.id);
          await page.goto(path);
          await page.waitForLoadState('domcontentloaded');

          await waitForStoryToRender(page, path);

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
