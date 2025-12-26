// ./pages/TitlesPage.js

const path = require("node:path");
const fs = require("node:fs");
const { BasePage } = require("./BasePage");
const { createResult, failResult } = require("../utils/result");
const { getHnTimestamps, getHnTitles } = require("../utils/hn");   
// const { parseHnTitle} = require("../utils/browser/hnDom");
// const { HN } = require("../utils/hnSelectors");

/**
 * Class for extracting info from titles page
 */
class TitlesPage extends BasePage {

    // Default locator for elements containing title text
    titleLocator = process.env.TITLE_LOCATOR ?? "tr.athing span.titleline > a";
    timestampLocator = process.env.TIMESTAMP_LOCATOR ?? "xpath=//tr[contains(@class, 'athing')]/following-sibling::tr[1]//span[@class='age']";


    hnDomUtil = path.join(__dirname, "../utils/browser/hnDom.js");

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);
    }

    // async setup(){
    //     await this.page.addInitScript(hnDomUtil);
    // }

    // async ensureHnDomInjected(page) {
    //     // idempotent: only inject once per page
    //     if (await page.evaluate(() => !!window.__hnDomInjected)) return;

    //     await page.addInitScript(this.hnDomSource);
    //     await page.addInitScript(() => {
    //         window.__hnDomInjected = true;
    //     });
    // }

    /**
     * Gets result of rowData
     * @returns {BaseResult}
     */
    async getTargetRows() {
        // await this.ensureHnDomInjected(this.page);
        const result = createResult({ message: "Fetched target rows..." });
        const rowElements = await this.getElements("tr.athing");
        // const timestamps = await this.page
        //     .locator("span.age")
        //     .evaluateAll((els) => els.map(el => el.getAttribute("title") ?? ""));
        const timestamps = await getHnTimestamps(this.page);
        const titles = await getHnTitles(this.page);
        console.log(`timestamps: ${titles}`);
        // const titles = await rowElements.locator("span.titleline").allTextContents();
        // const timestamps = await rowElements.locator("span.age").allTextContents();
        // const titles = await this.page.locator("tr.athing span.titleline").allTextContents();
        // const timestamps = 

        // console.log(`ts: ${timestamps}`);

        // const rows = await rowElements.evaluateAll((els) =>
        //     els.map((el) => {
        //         const id = el.getAttribute("id") ?? "";
        //         // const title = el.querySelector("span.titleline > a")?.textContent?.trim() ?? "";
        //         const title = window.hnGetTitle(el);
        //         const sub = el.nextElementSibling;
        //         const timestamp = sub?.querySelector("span.age")?.getAttribute("title")?.trim() ?? "";

        //         return { id, title, timestamp };
        //     }));

        return { ...result, data: rows };
    }


}

module.exports = { TitlesPage };