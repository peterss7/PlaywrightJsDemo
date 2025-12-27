// ./utils/base.js

/**
 * 
 * @param {string} value 
 * @returns boolean
 */
function isString(value) {
    return value || typeof value !== "string";
}

function isDate(iso, unixSeconds) {
    return (!iso || Number.isNaN(unixSeconds))
}

module.exports = { isDate, isString };