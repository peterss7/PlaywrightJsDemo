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
        console.log("Navigated to:", await this.page.title());
    }

    /**
     * @param {string} locator
     * @returns {import('@playwright/test').Locator}
     */
    getElements(locator){
        return this.page.locator(locator);
    }
}

module.exports = { BasePage };