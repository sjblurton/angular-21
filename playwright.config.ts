/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

const isVRTMode = !!process.env['VRT'];
const isCI = !!process.env['CI'];
const vrtPort = 6106;
const vrtHost = '127.0.0.1';

export default defineConfig({
  testDir: './e2e',
  testMatch: isVRTMode ? '**/vrt/**/*.spec.ts' : '**/*.spec.ts',
  testIgnore: isVRTMode ? undefined : '**/vrt/**',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isVRTMode ? 0 : isCI ? 2 : 0,
  workers: isVRTMode ? (isCI ? 2 : undefined) : isCI ? 1 : undefined,
  reporter: 'html',
  snapshotPathTemplate: 'snapshots/{testFilePath}/{testName}{ext}',
  use: {
    baseURL: isVRTMode ? `http://${vrtHost}:${vrtPort}` : 'http://localhost:4200',
    trace: isVRTMode ? 'off' : 'on-first-retry',
  },
  webServer: isVRTMode
    ? {
        command: isCI
          ? `npx http-server storybook-static -a ${vrtHost} -p ${vrtPort} -c-1 -s`
          : `test -d storybook-static || npx ng run angular-21:build-storybook; npx http-server storybook-static -a ${vrtHost} -p ${vrtPort} -c-1 -s`,
        url: `http://${vrtHost}:${vrtPort}`,
        reuseExistingServer: false,
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
