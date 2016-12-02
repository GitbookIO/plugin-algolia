const GitBook = require('gitbook-core');
const algoliasearch = require('algoliasearch');

const AlgoliaResults = require('./components/AlgoliaResults');
const unescape = require('./unescape');

const HITS_PER_PAGE = 15;

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Search, Components }) => {
        dispatch(Search.registerHandler('algolia', searchHandler));

        if (isFreeAccount(getState)) {
            dispatch(Components.registerComponent(AlgoliaResults, { role: 'search:results' }));
        }
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
                    // hit.body is escaped HTML, we need to unescape it
                    body:    unescape(hit.body),
                    url:     hit.url
                };
            });

            return resolve(results);
        }, reject);
    });
}

/**
 * #param {Function} getState
 * @return {Object} The plugin config
 */
function getConfig(getState) {
    return getState().config.getIn(['pluginsConfig', 'algolia']);
}

/**
 * Return the Algolia client. Initialize it if needed.
 *#param {Function} getState
 */
function getAlgoliaIndex(getState) {
    const config = getConfig(getState);
    const client = algoliasearch(config.get('applicationID'), config.get('publicKey'));
    return client.initIndex(config.get('index'));
}

/**
 * @param getState
 * @return {Boolean} true if the configured account is free
 */
function isFreeAccount(getState) {
    return getConfig(getState).get('freeAccount');
}
