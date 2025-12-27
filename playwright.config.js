// playwright.config.js
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');


/**
* @see https://playwright.dev/docs/test-configuration
*/
module.exports = defineConfig({
    testDir: './tests',
<<<<<<< HEAD
    retries: process.env.CI ? 2 : 0,    
    testMatch: /.*\.spec\.js/,
    use: {
        baseURL: process.env.BASE_URL,
        actionTimeout: 10_000,     
=======
    retries: process.env.CI ? 2 : 0,
    testMatch: /.*\.spec\.js/,
    use: {
        baseURL: process.env.BASE_URL,
        actionTimeout: 10_000,
>>>>>>> staging
        navigationTimeout: 30_000,
        ignoreHTTPSErrors: true,
        launchOptions: {
            headless: process.env.HEADLESS === "true",
            slowMo: Number(process.env.SLOW_MO) ?? 0,
        },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
<<<<<<< HEAD
});
=======
});
>>>>>>> staging
