const GitBook = require('gitbook-core');
const algoliasearch = require('algoliasearch');

const HITS_PER_PAGE = 15;

// Algolia index
let index;

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
    const config = getState().config.getIn(['pluginsConfig', 'algolia']);
    const index = getAlgoliaIndex(config);

    return new GitBook.Promise((resolve, reject) => {
        return index.search(query, { hitsPerPage: HITS_PER_PAGE })
        .then(function(res) {
            const results = res.hits.map(function(hit) {
                return {
                    title:   hit.title,
                    body:    hit['_highlightResult'].body.value,
                    url:     hit.url
                };
            });

            return resolve(results);
        }, reject);
    });
}

/**
 * Return the Algolia client. Initialize it if needed.
 * @param {Map} config The plugin config
 */
function getAlgoliaIndex(config) {
    if (index) return index;

    const client = algoliasearch(config.get('applicationID'), config.get('publicKey'));
    index = client.initIndex(config.get('index'));

    return index;
}
