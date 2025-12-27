// playwright.config.js
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');


/**
* @see https://playwright.dev/docs/test-configuration
*/
module.exports = defineConfig({
    testDir: './tests',
    retries: process.env.CI ? 2 : 0,
    testMatch: /.*\.spec\.js/,
    use: {
        baseURL: process.env.BASE_URL,
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        ignoreHTTPSErrors: true,
        launchOptions: {
            headless: process.env.HEADLESS === "true",
            slowMo: Number(process.env.SLOW_MO) ?? 0,
        },
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    reporter: [["html"], ["list"]],
});
