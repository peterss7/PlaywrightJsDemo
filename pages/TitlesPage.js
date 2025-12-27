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
     * @returns {{ok: boolean, title: string, unixSeconds: number, message: string}[]}
     */
    async getTargetRows() {
        try {
            const timestamps = await this.getAllAttributeContents(TIMESTAMP_LOCATOR, TITLE_ATTRIBUTE);
            const titles = await this.getAllTextContents(TITLES_LOCATOR);

            if (timestamps.length !== titles.length) {
                throw new Error(`Title/Timestamp length mismatch: ${timestamps.length}/${titles.length}`);
            }

            return timestamps.map((timestamp, i) => {
                const parsed = parseTimestamp(timestamp);
                return {
                    ok: true,
                    title: titles[i],
                    unixSeconds: parsed.unixSeconds,
                    message: "Success!"
                };
            });
        } catch (err) {
            return { ok: false, message: `failed to get target rows. Error: ${err.message}` };
        }
    }

    /**
     * Change the attribute of a timestamp
     */
    async manipulateTimestamps() {
        await this.setAttributeValue(TIMESTAMP_LOCATOR, TITLE_ATTRIBUTE);
    }
}

module.exports = { TitlesPage };