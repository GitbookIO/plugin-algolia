require([
    'gitbook',
    'jquery'
], function(gitbook, $) {
    // Define algolia search engine
    function AlgoliaSearchEngine(config) {
        // Create algolia client
        // eslint-disable-next-line no-undef
        this.client = algoliasearch(config.algolia.applicationID, config.algolia.publicKey);
        this.index = this.client.initIndex(config.algolia.index);
    }

    AlgoliaSearchEngine.prototype.init = function() {
        return $.Deferred().resolve().promise();
    };

    AlgoliaSearchEngine.prototype.search = function(q) {
        return this.index.search(q)
        .then(function(content) {
            return content.hits.map(function(h) {
                var parts = h.url.split('#');
                return {
                    path: parts[0],
                    hash: parts[1]
                };
            });
        });
    };

    window.SearchEngine = AlgoliaSearchEngine;
});