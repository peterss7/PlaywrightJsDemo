// tests/titlesPage.spec.js
const { test, expect } = require("@playwright/test");
const { TitlesPage } = require("../pages/TitlesPage");
const { getIsNewestToOldest } = require("../utils/time");

test("TitlesPage top 100 entries are in chronological order.", async ({ page }) => {
    const titlesPage = new TitlesPage(page);

    await titlesPage.goto("/newest");

    const rowData = await titlesPage.getTargetRows();
    const result = getIsNewestToOldest(rowData);

    expect(result.ok, result.message ?? "Not chronological").toBeTruthy();
});
