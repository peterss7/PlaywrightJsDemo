// ./utils/hn.js

/**
 * Formats and returns passed hacker news title
 * @param {string} title 
 * @returns {string}
 */
function formatHnTitle(title) {
    // return (title ?? "").replace(/\s+/g, "").trim();
    // Regex does not seem necessary currently
    return (title ?? "").trim();
}

module.exports = { formatHnTitle };