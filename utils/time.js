const { createResult, failResult } = require("./result");

/**
 * Returns true if data is in chronological order
 * @param {string[]} timeStamps
 * @returns {BaseResult}
 */
function checkNewestToOldest(timeStamps) {
    const result = createResult();
    let previousTime = null;

    timeStamps.forEach((timestamp, i) => {
        console.log(`Checking timestamp at index ${i}: "${timestamp}"`);
        const d = timestamp.split(" ")[0]?.trim();
        let currentTime = Number.isNaN(d) ? null : d;

        if (currentTime === null) {
            throw new Error("Parsed invalid Time from timestamp: ", timestamp);
        }

        if (previousTime === null) {
            previousTime = currentTime;
        }
        else {
            if (currentTime > previousTime) {
                return failResult(result, {
                    errorIndex: i, 
                    message: `Timestamps are not in chronological order at index ${i}: "${timestamp}"` 
                });
            }
            previousTime = currentTime;
        }
    });

    return result;
}

module.exports = { checkNewestToOldest };