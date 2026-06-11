import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT ?? "3000";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests",
  testMatch: "**/*.smoke.ts",
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  webServer: {
    command: `pnpm exec next dev -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-viewport",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 393, height: 851 },
        deviceScaleFactor: 2
      }
    }
  ]
});
