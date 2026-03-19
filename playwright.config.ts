/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const isVRTMode = !!process.env['VRT'];

export default defineConfig({
  testDir: './e2e',
  testMatch: isVRTMode ? '**/vrt/**/*.spec.ts' : '**/*.spec.ts',
  testIgnore: isVRTMode ? undefined : '**/vrt/**',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: isVRTMode ? 'http://localhost:6006' : 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  webServer: isVRTMode
    ? {
        command: 'npx serve storybook-static -l 6006',
        url: 'http://localhost:6006',
        reuseExistingServer: !process.env['CI'],
        timeout: 120_000,
      }
    : {
        command: 'npm run start',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env['CI'],
        timeout: 120_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
