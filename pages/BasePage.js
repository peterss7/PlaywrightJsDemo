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
        console.log("Navigated to:", await this.page.title());
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
    getElements(locator){
        return this.page.locator(locator);
    }

    /**
     * 
     * @param {*} mode 
     * @param {*} element 
     * @param {*} attribute 
     * @returns 
     */
    getRowValue(mode, element, attribute){
        console.log("mode in getRowValue: ", mode);
        const fn = this.valueModeHandlers[mode];
        if (!fn) throw new Error("Mode not recognized: ", mode);
        return fn(element, attribute);
    }

    async getAllRowValues(mode, elements, attribute="title"){
        return await elements.evaluateAll((els, args) => {
            const {mode, attribute} = args;

            const handlers = {
                TEXT_CONTENT: (element) => element.textContent?.trim() ?? "",
                ATTRIBUTE: (element, attribute) => element.getAttribute(attribute) ?? "",
            };

            return els.map((el) => {
                const fn = handlers[mode];
                if (!fn) throw new Error("Mode not recognized: ", mode);
                return fn(el, attribute);
            });
        }, {mode, attribute});
    }
}

module.exports = { BasePage };