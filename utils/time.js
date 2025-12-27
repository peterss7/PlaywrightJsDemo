
/**
 * Returns true if data is in chronological order
 * @param {string[]} timeStamps
 * @returns {Object}
 */
function checkNewestToOldest(unixSecondsArray) {
    let previousTime = -1;
    const result = { ok: true, message: "Success" };


    for (let i = 0; i < unixSecondsArray.length; i++) {
        if (result.ok) {
            const current = unixSecondsArray[i];
            if (current === null) {
                result = { ok: false, message: `Parsed invalid Time from timestamp: ${current}` };
            }

            if (previousTime === -1) {
                previousTime = current;
            }
            else {
                if (current > previousTime) {
                    result = { ok: false, message: "Order is not chronological." };
                }
                else{
                    previousTime = current;
                }
            }
        }
    }

    return { ok: true, message: "Success!" };
}

function parseTimestamp(timestamp) {

    const [iso, unix] = timestamp.trim().split(/\s+/);
    const unixSeconds = Number(unix);

    if (!(iso && !Number.isNaN(unixSeconds))) {
        return { ok: false, message: "Invalid timestamp format: ", timestamp };
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return { ok: false, message: "Could not parse date from timestamp: ", timestamp };
    }

    return { ok: true, data: { iso: iso, unixSeconds: unixSeconds, date: date } };
}

module.exports = { checkNewestToOldest, parseTimestamp };
