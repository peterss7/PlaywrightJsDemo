// tests/titlesPage.spec.js
const { TitlesPage } = require("../pages/TitlesPage");
const { checkNewestToOldest } = require("../utils/time");
const { test, expect } = require("@playwright/test");

test("TitlesPage top 100 entries are in chronological order.", async ({ page }) => {
    const titlesPage = new TitlesPage(page);

    await titlesPage.goto("/newest");
    // await titlesPage.setup();

    const rowDataResult = await titlesPage.getTargetRows();
    console.log(`rowData result: ${rowDataResult.data.map(r => r.timestamp)}`);
    const checkResult = checkNewestToOldest(rowDataResult.data.map(r => r.timestamp ));

    expect(checkResult.ok, checkResult.message).toBeTruthy();
});