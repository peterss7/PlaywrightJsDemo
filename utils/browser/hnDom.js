/**
 * 
 * @param {*} element 
 * @param {*} querySelector 
 * @returns string
 */
// This file is meant to run IN THE PAGE, not Node.
window.hnGetTitle = (el) =>
    el.querySelector("span.titleline > a")?.textContent?.trim() ?? "";

/**
 * Parses HN timestamp element
 * @param {*} element
 * @param {*} querySelector // = "span.age"
 * @param {*} attribute // = "title"
 * @returns string
 */
async function parseHnTimestamp(element, querySelector = "span.age", attribute = "title") {
    const r = await element?.querySelector(querySelector)?.getAttribute(attribute)?.trim() ?? "";
    console.log(r);
    return await element?.querySelector(querySelector)?.getAttribute(attribute)?.trim() ?? "";
}



module.exports = { parseHnTimestamp, parseHnTitle };