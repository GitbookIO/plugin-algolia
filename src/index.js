const GitBook = require('gitbook-core');
const algoliasearch = require('algoliasearch');

const HITS_PER_PAGE = 15;

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Search }) => {
        dispatch(Search.registerHandler('algolia', searchHandler));
    },
    reduce: (state, action) => state
});

/**
 * Search against a query
 * @param  {String} query
 * @return {Promise<List<Result>>}
 */
function searchHandler(query, dispatch, getState) {
    const index = getAlgoliaIndex(getState);

    return new GitBook.Promise((resolve, reject) => {
        return index.search(query, { hitsPerPage: HITS_PER_PAGE })
        .then(function(res) {
            const results = res.hits.map(function(hit) {
                return {
                    title:   hit.title,
                    body:    hit.body,
                    url:     hit.url
                };
            });

            return resolve(results);
        }, reject);
    });
}

/**
 * Return the Algolia client. Initialize it if needed.
 * @param getState
 */
function getAlgoliaIndex(getState) {
    const config = getState().config.getIn(['pluginsConfig', 'algolia']);
    const client = algoliasearch(config.get('applicationID'), config.get('publicKey'));
    return client.initIndex(config.get('index'));
}
