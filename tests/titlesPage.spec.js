// tests/titlesPage.spec.js
const { test, expect } = require("@playwright/test");
const { TitlesPage } = require("../pages/TitlesPage");
const { checkNewestToOldest } = require("../utils/time");

/** @typedef {import("../types/result").BaseResult } BaseResult */

test("TitlesPage top 100 entries are in chronological order.", async ({ page }) => {
    const titlesPage = new TitlesPage(page);

    await titlesPage.goto("/newest");

    const rowDataResult = await titlesPage.getTargetRows();
    // console.log(`rowData result: ${rowDataResult}`);
    const result = checkNewestToOldest(rowDataResult.data.message);

    // console.log(`Final Result: ${result.ok}, ${result.message}`);

    expect(result.ok, result.message).toBeTruthy();
});
