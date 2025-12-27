// ./pages/TitlesPage.js

const { BasePage } = require("./BasePage");
const { parseTimestamp } = require("../utils/time");

const TITLES_LOCATOR = "tr.athing span.titleline > a"
const TIMESTAMP_LOCATOR = "span.age";
const TITLE_ATTRIBUTE = "title";

/**
 * Class for extracting info from titles page
 */
class TitlesPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);
    }

    /**
     * Retrieve target rows with title and unixSeconds
     * @returns {{title: string, unixSeconds: number}[]}
     */
    async getTargetRows() {
        const timestamps = await this.getAllAttributeContents(TIMESTAMP_LOCATOR, TITLE_ATTRIBUTE);
        const titles = await this.getAllTextContents(TITLES_LOCATOR);

        if (timestamps.length !== titles.length) {
            throw new Error(`Title/Timestamp length mismatch: ${timestamps.length}/${titles.length}`);
        }

        return timestamps.map((timestamp, i) => {
            const parsed = parseTimestamp(timestamp);
            return {
                title: titles[i],
                unixSeconds: parsed.unixSeconds
            };
        });
    }
}

module.exports = { TitlesPage };