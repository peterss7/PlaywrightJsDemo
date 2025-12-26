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
        // console.log("Navigated to:", await this.page.title());
    }

    /**
     * Click element by role
     * @param {string} role 
     * @param {import('@playwright/test').LocatorOptions} options 
     */
    async clickByRole(role, options = null) {
        await this.page.getByRole(role, options).click();
        await this.page.waitForLoadState("domcontentloaded");
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