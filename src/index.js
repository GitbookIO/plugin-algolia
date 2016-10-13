const GitBook = require('gitbook-core');

/**
 * Search in the local index
 * @param  {String} query
 * @return {Promise<List>}
 */
function searchHandler(query, dispatch, getState) {
    return [];
}

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Search }) => {
        dispatch(Search.registerHandler('algolia', searchHandler));
    },
    reduce: (state, action) => state
});
