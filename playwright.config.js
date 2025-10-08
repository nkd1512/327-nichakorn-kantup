// @ts-check
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv'; // Import dotenv as ES module

/**
 * Read environment variables from .env file.
 * We must use .config() here to load them before Playwright starts.
 *
 * NOTE: We use try/catch because process.env.CI is available only when running on CI/CD pipeline
 */
try {
  dotenv.config();
} catch (error) {
  // Ignore error if dotenv is not found or config fails during CI run
}

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where tests are located
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  // We use '0' to resolve the TypeScript 'null/undefined' worker type issue.
  workers: process.env.CI ? 1 : 0,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: 'html',

  // Shared settings for all the projects below.
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    // We assume Quasar dev server runs on 9000
    baseURL: process.env.BASE_URL || 'http://localhost:9000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:9000',
    reuseExistingServer: !process.env.CI,
  },
});
