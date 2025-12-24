// ./utils/time.js

const { createResult, failResult } = require("../utils/result");

/** @typedef {import("../types/hn").HnRow} HnRow */
/** @typedef {import("../types/hn").HnTimestamp} HnTimestamp */
/** @typedef {import("../types/result").BaseResult} BaseResult */

/**
 * returns parsed time for chronology check
 * @param {string} timestamp // e.g. "2025-12-23T19:25:27 1766517927"
 * @param {number} index
 * @returns {BaseResult}
 */
function parseHnTimestamp(timestamp, index) {
    if (typeof index !== "number") index = -1;
    const result = createResult({ messsage: "Parsed HnTimestamp..." });

    if (!timestamp || typeof timestamp !== "string") {
        return failResult(result, { message: `Timestamp ${timestamp} is not a string...` });
    }

    const [iso, unix] = timestamp.trim().split(/\s+/);
    const unixSeconds = Number(unix);
    if (!iso || Number.isNaN(unixSeconds)) {
        return failResult(result, { message: `iso is null or unixSeconds ${unixSeconds} is NaN...` });
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return failResult(result, { message: `Could not parse ISO date from timestamp "${timestamp}"` });
    }

    result.data = { iso, unixSeconds, date };

    return result;
}

/**
 * Returns true if array is ordered newest to oldest 
 * @param {HnRow[]} rows 
 * @returns {BaseResult}
 */
function checkNewestToOldest(rows) {
    const result = createResult({ message: "Ok; Check chronology successful..." });
    if (!Array.isArray(rows)) {
        return failResult({ result, message: "rows is not an array" });
    }

    for (let i = 1; i < rows.length; i++) {
        const previous = rows[i - 1];
        const current = rows[i];
        if (current.unixSeconds > previous.unixSeconds) {
            return failResult({
                result,
                breakIndex: i,
                message:
                    `Order breaks at i=${i}:\n` +
                    `   previous: [id=${previous.id}] ${previous.unixSeconds} "${rowData[i].title}"\n` +
                    `   current : [id=${current.id}] ${current.unixSeconds} "${current.title}"\n` +
                    `   current is newer than previous, should be newest -> oldest!`,
            });
        }
    }
    return result;
}

module.exports = { parseHnTimestamp, checkNewestToOldest };