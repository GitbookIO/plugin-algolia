require([
    'gitbook',
    'jquery'
], function(gitbook, $) {
    var freeAccount = true;

    // Define algolia search engine
    function AlgoliaSearchEngine(config) {
        // Create algolia client
        // eslint-disable-next-line no-undef
        this.client = algoliasearch(config.algolia.applicationID, config.algolia.publicKey);
        this.index  = this.client.initIndex(config.algolia.index);
        this.name   = 'AlgoliaSearchEngine';
    }

    AlgoliaSearchEngine.prototype.init = function() {
        return $.Deferred().resolve().promise();
    };

    AlgoliaSearchEngine.prototype.search = function(q, offset, length) {
        var d = $.Deferred();

        this.index.search(q, { hitsPerPage: length })
        .then(function(res) {
            // return content;
            var results = res.hits.map(function(hit) {
                return {
                    title:   hit.title,
                    body:    hit['_highlightResult'].body.value,
                    url:     hit.url
                };
            });

            d.resolve({
                query:   res.query,
                count:   res.nbHits,
                results: results
            });
        })
        .catch(function(err) {
            d.reject(err);
        });

        return d.promise();
    };

    gitbook.events.bind('start', function(e, config) {
        // Set gitbook research to Algolia
        gitbook.search.setEngine(AlgoliaSearchEngine, config);

        // Set account type
        freeAccount = config.algolia.freeAccount;
    });

    gitbook.events.on('page.change', function() {
        if (freeAccount) {
            // Add Algolia logo for free accounts
            var $searchResultsTitle = $('.search-results-title');

            var $poweredBy = $('<span>', {
                text: 'powered by ',
                class: 'powered-by-algolia'
            });
            var $algoliaLogo = $('<img>', {
                src: 'gitbook/gitbook-plugin-algolia/algolia-logo.jpg'
            });

            $poweredBy.append($algoliaLogo);
            $searchResultsTitle.before($poweredBy);
        }
    });
});