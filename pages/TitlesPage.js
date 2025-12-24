// ./pages/TitlesPage.js

const { BasePage } = require("./BasePage");

class RowData {
    /**
     * Data of a row
     * @param {string} title 
     * @param {string} timestamp 
     */
    constructor(title, timestamp) {
        this.title = title;
        this.timestamp = timestamp;
    }
}


/**
 * Class for extracting info from titles page
 */
class TitlesPage extends BasePage {

    // Default locator for elements containing title text
    titleLocator = process.env.TITLE_LOCATOR ?? "tr.athing span.titleline > a";
    timestampLocator = process.env.TIMESTAMP_LOCATOR ?? "xpath=//tr[contains@class, 'athing')]/following-sibling::tr[1]//span[@class='age']";

    /**
     * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        super(page);
    }

    /**
     * Get array of titles with locator
     * @param {string} locator
     * @returns {Promise<string[]>}
     */
    async getTitles(locator = this.titleLocator) {
        const elements = this.getElements(locator);
        return await elements.evaluateAll((els) =>
            els.map((el) => (el.textContent || "").trim())
        );
    }

    /**
     * Get array of timestamps of elements.
     * @param {timestampLocator} timestampLocator
     * @returns {Promise<string[]>}
     */
    async getTimestamps(
        timestampLocator = this.timestampLocator
    ) {

        const timestamps = this.getElements(timestampLocator);
        return await timestamps.evaluateAll((els) =>
            els.map((el) => (el.getAttribute("title") || "").trim())
        );
    }

    /**
     * Returns array of row data
     * @param {string} titleLocator 
     * @param {string} timestampLocator 
     * @returns {Promise<RowData[]>}
     */
    async getRowData(
        titleLocator = this.titleLocator,
        timestampLocator = this.timestampLocator
    ) {
        const titles = await this.getTitles(titleLocator);
        const timestamps = await this.getTimestamps(timestampLocator);
        const rowData = []

        if (titles.length !== timestamps.length) {
            throw new Error(`Rowdata Mismatch: titles=${titles.length}, timestamps=${timestamps.length}`);
        }

        for (let i = 0; i < titles.length; i++) {
            rowData.push(new RowData(titles[i], timestamps[i]));
        }

        return rowData;
    }

    /**
     * Returns true if data is in chronological order
     * @param {RowData[]} rowData 
     * @returns {object}
     */
    static getIsChronological(rowData) {
        let previousTime = null;

        rowData.forEach((row, i) => {
            const d = row.timestamp.split(" ")[0]?.trim();
            let currentTime = Number.isNaN(d) ? null : d;
            
            // console.log("previous: ", previousTime);

            if (currentTime === null) {
                throw new Error("Parsed invalid Time from row: ", row.title);
            }

            if (previousTime === null) {
                previousTime = currentTime;
            }
            else {
                if (currentTime > previousTime) {
                    return {
                        ok: false,
                        errorIndex: i,
                        reason:
                            `Out of chronological order.` +
                            `Title: ${row.title}.` +
                            `Timestamp ${currentTime} is more recent than previous ${previousTime}.`
                    };
                }
                previousTime = currentTime;
            }
        });

        return { ok: true }
    }
}

module.exports = { TitlesPage };