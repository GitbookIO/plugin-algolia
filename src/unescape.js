/**
 * Unescape an HTML string. XSS vulnerable!
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    const el = document.createElement('div');
    // XSS can happen here... But we trust the results from Algolia,
    // and the impact of XSS is limited on books
    el.innerHTML = str;
    return el.textContent;
}

module.exports = unescape;
