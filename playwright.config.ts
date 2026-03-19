/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const isVRTMode = !!process.env['VRT'];
const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  testMatch: isVRTMode ? '**/vrt/**/*.spec.ts' : '**/*.spec.ts',
  testIgnore: isVRTMode ? undefined : '**/vrt/**',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isVRTMode ? 0 : isCI ? 2 : 0,
  workers: isVRTMode ? (isCI ? 2 : undefined) : isCI ? 1 : undefined,
  reporter: 'html',
  snapshotPathTemplate: 'snapshots/{testFilePath}/{arg}{ext}',
  use: {
    baseURL: isVRTMode ? 'http://localhost:6006' : 'http://localhost:4200',
    trace: isVRTMode ? 'off' : 'on-first-retry',
  },
  webServer: isVRTMode
    ? {
        command: isCI
          ? 'npx serve storybook-static -l 6006'
          : 'test -d storybook-static || npx storybook build; npx serve storybook-static -l 6006',
        url: 'http://localhost:6006',
        reuseExistingServer: !isCI,
        timeout: 120_000,
      }
    : {
        command: 'npm run start',
        url: 'http://localhost:4200',
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
