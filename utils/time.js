// ./utils/time.js

/** @typedef {import("../types/hn").HnRow} HnRow */
/** @typedef {import("../types/hn").HnTimestamp} HnTimestamp */
/** @typedef {import("../types/result").ResultObject} ResultObject */

/**
 * returns parsed time for chronology check
 * @param {string} timestamp 
 * @returns {HnTimestamp}
 */
function parseHnTimestamp(timestamp) {

    if (!timestamp || typeof timestamp !== "string") {
        throw new Error(`Invalid time value: ${timestamp}`);
    }

    const [iso, unix] = timestamp.trim().split(/\s+/);
    const unixSeconds = Number(unix);

    if (!iso || Number.isNaN(unixSeconds)) {
        throw new Error(`Unexpected/invalid time parsed from ${row.timestamp}`);
    }

    return { iso, unixSeconds, date: new Date(iso) };
}

/**
 * Returns true if array is ordered newest to oldest 
 * @param {HnRow} rowData 
 * @returns {ResultObject}
 */
function getIsNewestToOldest(rowData) {
    const unixSecondsList = rowData.map(r => parseHnTimestamp(r.ageTitle).unixSeconds);
    for (let i = 1; i < unixSecondsList.length; i++) {
        const prev = unixSecondsList[i - 1];
        const cur = unixSecondsList[i];
        if (cur > prev) {
            return {
                ok: false,
                index: i,
                message: `Order breaks at i=${i}: ${cur} is newer than ${prev}, title: ${rowData[i].title}`,
            };
        }
    }
    return { ok: true };
}

module.exports = { parseHnTimestamp, getIsNewestToOldest };