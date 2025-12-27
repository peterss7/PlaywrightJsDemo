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
    expect(result?.ok, result?.message).toBeTruthy();
});

test("Fail_Has_Invalid_Timestamp", async({page}) => {
    const titlesPage = new TitlesPage(page);
    await titlesPage.goto("/newest");

    await titlesPage.manipulateTimestamps();
    const rowsResult = await titlesPage.getTargetRows();
    expect(!rowsResult.ok, rowsResult.message).toBeTruthy();
});

test("Fail_Not_Chronological", async({page}) => {
    const titlesPage = new TitlesPage(page);
    await titlesPage.goto("/newest");

    const rows = await titlesPage.getTargetRows();
    const timestamps = rows.map(r => r.unixSeconds);
    const temp = timestamps[0];
    
    timestamps[0] = timestamps[1];
    timestamps[1] = temp;

    try{
        checkNewestToOldest(timestamps);
    } catch(err){
        if (err.data) console.error(data);
        expect(err.code === "CHRONOLOGY").toBeTruthy();
    }
});