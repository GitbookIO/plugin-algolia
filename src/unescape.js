const entities = require('html-entities');
const htmlEntities = new entities.AllHtmlEntities();

/**
 * Unescape all entities (HTML + XML)
 * @param  {String} str
 * @return {String}
 */
function unescape(str) {
    return htmlEntities.decode(str);
}

module.exports = unescape;
