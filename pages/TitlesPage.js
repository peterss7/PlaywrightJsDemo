// ./pages/TitlesPage.js

const path = require("node:path");
const { BasePage } = require("./BasePage");
const { parseTimestamp } = require("../utils/time");
// const { parseHnTitle} = require("../utils/browser/hnDom");
// const { HN } = require("../utils/hnSelectors");

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
     * 
     * @returns Object
     */
    async getTargetRows() {
        const rows = [];

        const timestamps = await this.getTimestamps();
        const titles = await this.getTitles();

        // console.log("timestamps", JSON.stringify(timestamps));
        // console.log("Titles", JSON.stringify(titles));


        if (timestamps.length !== titles.length) {
            return { ok: false, message: `Title/Timestamp length mismatch: ${timestamps.length}/${titles.length}` };
        }

        for (let i = 0; i < timestamps.length; i++) {

            const parseTimestampResult = parseTimestamp(timestamps[i]);
            if (!parseTimestampResult.ok) {
                return parseTimestampResult;
            }

            rows.push({ title: titles[i], unixSeconds: parseTimestampResult.data.unixSeconds });
        }

        return { ok: true, message: "Successfully found target row data.", data: rows };
    }

    async getTimestamps() {
        return await this.page
            .locator(TIMESTAMP_LOCATOR)
            .evaluateAll((els, attribute) =>
                els.map(el => el.getAttribute(attribute) ?? ""),
                TITLE_ATTRIBUTE);
    }

    async getTitles() {
        return await this.page
            .locator(TITLES_LOCATOR)
            .allTextContents();
    }

}

module.exports = { TitlesPage };