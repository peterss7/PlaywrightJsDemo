/**
 * 
 * @param {*} page 
 * @param {*} timestampLocator 
 * @param {*} attribute 
 * @returns 
 */
async function getHnTimestamps(page, timestampLocator = "span.age", attribute = "title") {
    return page
        .locator(timestampLocator)
        .evaluateAll((els, attribute) => els.map(el => el.getAttribute(attribute) ?? ""), attribute);
}

/**
 * 
 * @param {*} page 
 * @param {*} titlesLocator 
 * @returns
 */
async function getHnTitles(page, titlesLocator = "tr.athing span.titleline > a") {
    return await page
        .locator(titlesLocator)
        .allTextContents();
}

module.exports = { getHnTimestamps, getHnTitles };

