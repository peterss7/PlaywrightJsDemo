// ./pages/TitlesPage.js

const { BasePage } = require("./BasePage");
const { formatHnTitle } = require("../utils/hn");
const { parseHnTimestamp } = require("../utils/time");
const { TableSelector } = require("../enums/TableSelector");
const { createResult, failResult } = require("../utils/result");
const { create } = require("node:domain");

/** @typedef {import("../types/result").BaseResult } BaseResult */

/**
 * Class for extracting info from titles page
 */
class TitlesPage extends BasePage {

    // Default locator for elements containing title text
    titleLocator = process.env.TITLE_LOCATOR ?? "tr.athing span.titleline > a";
    timestampLocator = process.env.TIMESTAMP_LOCATOR ?? "xpath=//tr[contains(@class, 'athing')]/following-sibling::tr[1]//span[@class='age']";

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page, titleLocator = null, timestampLocator = null) {
        super(page);
        // replace default values if any passed to constructor
        if (titleLocator && typeof titleLocator === "string") {
            this.titleLocator = titleLocator;
        }
        if (timestampLocator && typeof timestampLocator === "string") {
            this.timestampLocator = timestampLocator;
        }
    }


    /**
     * Gets all rows from what is currently visible
     * @param {BaseResult} result 
     * @returns {BaseResult}
     */
    async getCurrentHnRows(result) {
        const rows = await this.page.locator("tr.athing").evaluateAll((things) => {
            return things.map((tr) => {
                const id = tr.getAttribute("id") ?? "";
                const title = tr.querySelector("span.titleline > a")?.textContent?.trim() ?? "";

                const sub = tr.nextElementSibling;
                const timestamp = sub?.querySelector("span.age")?.getAttribute("title") ?? "";

                return { id, title, timestamp };
            });
        });

        console.log("res in getCur: ", result);

        return { ...result, data: rows };
    }

    /**
     * Returns first n rows of table data
     * @param {number} n = 100
     * @returns {BaseResult}
     */
    async getHnRows(n = 100) {
        const result = createResult();
        const rowData = [];
        
        console.log("first res: ", result);
        const t = this.getCurrentHnRows(result);

        console.log(`ok: ${t.ok}, message: ${t.message}`);

        return result;


        // Loop until we have n rows
        // while (true) {
        //     // A fail safe
        //     if (rowData.length >= n) {
        //         break;
        //     }

        //     const newRowsResult = await this.getCurrentHnRows(result);

        //     if (!newRowsResult.ok) {
        //         return newRowsResult;
        //     }

        //     const newRows = newRowsResult.data;

        //     if (newRows.length + rowData.length > n) {
        //         newRows.splice(n - rowData.length);
        //     }

        //     // Add new rows to rowData
        //     for (let i = 0; i < newRows.length; i++) {
        //         const unixSecondsResult = parseHnTimestamp(newRows[i].timestamp, newRows[i].id);
        //         if (!unixSecondsResult.ok) {
        //             return unixSecondsResult;
        //         }
        //         rowData.push({ id: newRows[i].id, title: newRows[i].title, timestamp: newRows[i].timestamp, unixSeconds: unixSecondsResult.data.unixSeconds });
        //     }

        //     // Check if we have enough rows
        //     if (rowData.length >= n) {
        //         break;
        //     }

        //     // Navigate to next page for more rows
        //     const more = this.page.getByRole("link", { name: "More" }).first();
        //     await more.scrollIntoViewIfNeeded();
        //     await more.click();

        // }

        // result.data = rowData;

        // return result;
    }
}


module.exports = { TitlesPage };