// ./pages/BasePage.js

/**
 * Class for the most basic page functions
 */
class BasePage {
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
    }

    /**
     * Click button, wait for load after
     * @param {string} buttonLocator 
     * @param {string} attribute 
     * @param {string} rowLocator 
     */
    async clickButton(buttonLocator, attribute, rowLocator = null) {
        if (rowLocator !== null) {

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
     * Retrieve all text contents for locator
     * @param {string} locator 
     * @returns {Promise<string[]>}
     */
    async getAllTextContents(locator) {
        return await this.page
            .locator(locator)
            .allTextContents();
    }

    /**
     * Returns all attribute contents for locator
     * @param {string} locator 
     * @param {string} attribute 
     * @returns {Promise<string[]>}
     */
    async getAllAttributeContents(locator, attribute) {
        return await this.page
            .locator(locator)
            .evaluateAll((els, attribute) =>
                els.map(el => el.getAttribute(attribute) ?? ""),
                attribute);
    }

    async setText(locator, attribute, newValue) {
        const targetElement = this.page.locator(locator).first();

        const before = await targetElement.getAttribute(attribute);
        console.log("before:", before);

        await targetElement.evaluate(el => {
            // break the format parseTimestamp expects: "<iso> <unix>"
            el.setAttribute(attribute, newValue);
        });

        const after = await targetElement.getAttribute(attribute);
        console.log("after:", after);
    }
}

module.exports = { BasePage };