// tests/titlesPage.spec.js
const { TitlesPage } = require("../pages/TitlesPage");
const { checkNewestToOldest } = require("../utils/time");
const { test, expect } = require("@playwright/test");

test("Pass_Titles_Are_NewestToOldest", async ({ page }) => {
    const titlesPage = new TitlesPage(page);

    await titlesPage.goto("/newest");

    const rowDataResult = await titlesPage.getTargetRows();
    const checkResult = checkNewestToOldest(rowDataResult.data.map(r => r.unixSeconds));

    expect(checkResult.ok, checkResult.message).toBeTruthy();
});
