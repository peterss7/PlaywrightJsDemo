// ./utils/result.js

/** @typedef {import("../types/result").BaseResult} BaseResult */

/**
 * Creates initial BaseResult object
 * @param {boolean} ok = true
 * @param {string} message = null
 * @param {string} index = null
 * @param {any} data = null
 * @returns {BaseResult}
 */
function createResult(ok = true, message = "Success!", breakIndex = null, data = null) {
    return {
        ok: true,
        breakIndex: breakIndex,
        message: message,
        data: data
    }
}

/**
 * Fails a baseResult
 * @param {BaseResult} result 
 * @param {Partial<BaseResult>} patch
 * @returns {BaseResult}
 */
function failResult(result, patch = {}) {
    return { ...result, ...patch, ok: false };
}

module.exports = { createResult, failResult }