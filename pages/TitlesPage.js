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
     * Returns first n rows of table data
     * @param {number} n = 100
     * @returns {Promise<HnRowData[]>}
     */
    async getTargetRows(n = 100) {
        const rowData = [];

        // Loop until we have n rows
        while (true) {
            // A fail safe
            if (rowData.length >= n) {
                break;
            }
            // Get titles and timestamps from current page
            const newTitles = await this.getTitles();
            const newTimestamps = await this.getTimestamps();
            // console.log(`timestamps: ${newTimestamps}`);

            // Ensure we have matching counts
            if (newTitles.length !== newTimestamps.length) {
                throw new Error(`Title/timestamp count mismatch: ${newTitles.length} titles vs ${newTimestamps.length} timestamps`);
            }

            // If adding all new rows would exceed n, trim the extras
            if (newTitles.length + rowData.length > n) {
                newTitles.splice(n - rowData.length);
                newTimestamps.splice(n - rowData.length);
            }

            // Add new rows to rowData
            for (let i = 0; i < newTitles.length; i++) {
                rowData.push({ title: newTitles[i], timestamp: newTimestamps[i] });
            }

            // Check if we have enough rows
            if (rowData.length >= n) {
                break;
            }

            // Navigate to next page for more rows
            await this.clickButton("a.morelink", "id", "tr.athing");
        }

        return rowData;
    }

    /**
     * Returns titles from current page
     * @returns {Promise<string[]>}
     */
    async getTitles() {
        // Get title elements
        const newTitleElements = this.getElements(this.titleLocator);

        // Ensure we have some elements
        if (!newTitleElements || newTitleElements.count === 0) {
            throw new Error("No title elements, but more were expected: ", this.titleLocator);
        }

        // Extract titles
        const newTitles = await this.getAllRowValues(TableSelector.TEXT_CONTENT, (await newTitleElements));

        // Format titles and return
        return newTitles.map(t => formatHnTitle(t));
    }

    /**
     * Returns timestamps from current page
     * @returns {Promise<number[]>}
     */
    async getTimestamps() {
        const newTimestampElements = await this.getElements(this.timestampLocator);
        console.log(`new timestamps count: ${newTimestampElements.count}`);
        if (!newTimestampElements || newTimestampElements.count === 0) {
            throw new Error("No timestamp elements, but more were expected: ", this.timestampLocator);
        }
        const newTimestamps = await this.getAllRowValues(TableSelector.ATTRIBUTE, newTimestampElements);
        return newTimestamps.map(ts => parseHnTimestamp(ts).unixSeconds);
    }
}

module.exports = { TitlesPage };