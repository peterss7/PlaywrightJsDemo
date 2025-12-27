// ./utils/time.js

const { ChronologyError, TimestampParseError } = require("../errors/ValidationError");

/**
 * Checks that array of unix seconds timestamps is in newest->oldest order
 * @param {string[]} timeStamps
 */
function checkNewestToOldest(unixSecondsArray) {
    for (let i = 1; i < unixSecondsArray.length; i++) {
        const previous = unixSecondsArray[i - 1];
        const current = unixSecondsArray[i];

        if (!Number.isFinite(previous) || !Number.isFinite(current)) {
            throw new TimestampParseError(`Invalid unixSeconds at index ${i - 1} or ${i}`, {
                i,
                previous,
                current
            });
        }
        if (current > previous) {
            throw new ChronologyError("Titles not chronological, newest to oldest", { 
                i, 
                previous, 
                current,
            });
        }
    }
    return { ok: true, message: "Success!" };
}

/**
 * Parses timestamp string into object
 * @param {string} timestamp // e.g. "2025-12-23T19:25:27 1766517927"
 * @returns {Object} // { iso: string, unixSeconds: number, date: Date }
 */
function parseTimestamp(timestamp) {
    const [iso, unix] = timestamp.trim().split(/\s+/);
    const unixSeconds = Number(unix);
    if (!(iso && !Number.isNaN(unixSeconds))) {
        throw new Error(`Invalid timestamp format: ${timestamp}`);
    }

    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Could not parse date from timestamp: ${timestamp}`);
    }

    return { iso, unixSeconds, date };
}

module.exports = { checkNewestToOldest, parseTimestamp };
