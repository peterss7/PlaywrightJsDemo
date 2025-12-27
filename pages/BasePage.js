// ./pages/BasePage.js

const TableSelector = require("../enums/TableSelector");

/**
 * Class for the most basic page functions
 */
class BasePage {
    // Handles data extraction from table
    static valueModeHandlers = {
        TEXT_CONTENT: (element) => element.textContent?.trim() ?? "",
        ATTRIBUTE: (element, attribute) => element.getAttribute(attribute) ?? "",
    };

    /**
    * @param {import('@playwright/test').Page} page 
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Nav to URL
     * @param {string} path
     */
    async goto(path) {
        await this.page.goto(path, { waitUntil: "domcontentloaded" });
        // console.log("Navigated to:", await this.page.title());
    }

    /**
     * Click button, wait for load after
     * @param {string} buttonLocator 
     * @param {string} attribute 
     * @param {string} rowLocator 
     */
    async clickButton(buttonLocator, attribute, rowLocator = null) {
        if (rowLocator !== null) {
            
            const t = await this.page.locator(rowLocator);
            // console.log(`t: ${t}`);
            const firstId = await this.page.locator(rowLocator).first().getAttribute(attribute);

            await Promise.all([
                this.page.waitForLoadState("domcontentloaded"),
                this.page.locator(buttonLocator).click(),
            ]);

            // ensure content changed (prevents re-reading same page)
            await this.page.waitForFunction(
                ({ attribute, rowLocator, firstId }) =>
                    document.querySelector(rowLocator)?.getAttribute(attribute) !== firstId,
                { attribute, attribute, firstId }
            );
        }
    }

    /**
     * @param {string} locator
     * @returns {import('@playwright/test').Locator}
     */
    async getElements(locator){
        return await this.page.locator(locator);
    }
}

module.exports = { BasePage };