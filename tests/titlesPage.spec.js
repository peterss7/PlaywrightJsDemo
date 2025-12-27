// tests/titlesPage.spec.js
const { TitlesPage } = require("../pages/TitlesPage");
const { assertNewestToOldest } = require("../utils/time");
const { test, expect } = require("@playwright/test");

/**
 * Test that titles are sorted newest to oldest
 */
test("Pass_Titles_Are_NewestToOldest", async ({ page }) => {
    const titlesPage = new TitlesPage(page);
    await titlesPage.goto("/newest");

    const rows = await titlesPage.getTargetRows();
    assertNewestToOldest(rows.map(r => r.unixSeconds));
});
