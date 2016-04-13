var algoliasearch = require('algoliasearch');

var client = null;
var index = null;

module.exports = {
    book: {
        assets: './assets',
        js: [
            'algoliasearch.min.js', 'search-algolia.js'
        ]
    },

    hooks: {
        init: function() {
            // Initialize Algolia client
            var config = this.config.get('pluginsConfig.algolia') || this.config.get('algolia');
            client = algoliasearch(config.applicationID, process.env.ALGOLIA_PRIVATEKEY);

            // Initialize index with book's title
            index = client.initIndex(config.index);

            // Clean index for updates
            return index.clearIndex();
        },

        page: function(page) {
            // Don't index when not generating website or if index has not been set
            if (this.output.name != 'website' || !index) return page;

            this.log.debug.ln('index page', page.path);
            // Transform as text
            text = page.content.replace(/(<([^>]+)>)/ig, '');

            // Add to index
            return index.addObject({
                url:   this.output.toURL(page.path),
                path:  page.path,
                title: page.title,
                body:  text,
                level: page.level,
                depth: page.depth
            })
            .then(function() {
                return page;
            });
        }
    }
};