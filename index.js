// ./index.js
require("dotenv").config();

const { chromium } = require("playwright");
const { TitlesPage } = require("./pages/TitlesPage");
const { expect } = require("@playwright/test");

const baseUrl = process.env.BASE_URL ?? "https://example.com";
const headless = (process.env.HEADLESS ?? "true").toLowerCase() === "true";
const slowMo = Number(process.env.SLOW_MO ?? "0");

async function sortHackerNewsArticles() {
    // launch browser
    const browser = await chromium.launch({ headless: headless });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Create test object
    const titlesPage = new TitlesPage(page);

    // go to Hacker News
    await titlesPage.goto(baseUrl);

    // Get row data
    const rowData = await titlesPage.getRowData();

    // Perform test
    expect(TitlesPage.getIsChronological(rowData).ok).toBe(true);

    await browser.close();

}

(async () => {
    await sortHackerNewsArticles();
})();
