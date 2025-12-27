// tests/titlesPage.spec.js

const { TitlesPage } = require("../pages/TitlesPage");
const { checkNewestToOldest } = require("../utils/time");
const { test, expect } = require("@playwright/test");


/**
 * Test that titles are sorted newest to oldest
 */
test("Pass_Titles_Are_NewestToOldest", async ({ page }) => {
    const titlesPage = new TitlesPage(page);
    await titlesPage.goto("/newest");

    const rows = await titlesPage.getTargetRows();
    const result = checkNewestToOldest(rows.map(r => r.unixSeconds));
    console.log(JSON.stringify(result));
    expect(result?.ok, result?.message).toBeTruthy();
});

test("Fail_Has_Invalid_Timestamp", async({page}) => {
    const titlesPage = new TitlesPage(page);
    await titlesPage.goto("/newest");

    await titlesPage.manipulateTimestamps();
    const rowsResult = await titlesPage.getTargetRows();
    expect(!rowsResult.ok, rowsResult.message).toBeTruthy();
});