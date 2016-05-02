var algoliasearch = require('algoliasearch');

var client = null;
var index = null;

module.exports = {
    book: {
        assets: './assets',
        js: [
            'https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js', 'search-algolia.js'
        ],
        css: ['plugin-algolia.css']
    },

    hooks: {
        init: function() {
            // Don't index when not generating website
            if (this.output.name != 'website') return;

            // Check that private key has been provided
            if (!process.env.ALGOLIA_PRIVATEKEY) {
                this.log.warn.ln('Algolia indexation is disabled:');
                this.log.warn.ln('You need to configure the ALGOLIA_PRIVATEKEY environment variable using your Admin API Key.');
                return;
            }

            // Initialize Algolia client
            var config = this.config.get('pluginsConfig.algolia') || this.config.get('algolia');
            client = algoliasearch(config.applicationID, process.env.ALGOLIA_PRIVATEKEY);

            // Initialize index with book's title
            index = client.initIndex(config.index);

            // Clean index for updates
            return index.clearIndex()
            .then(function(content) {
                return index.waitTask(content.taskID);
            });
        },

        page: function(page) {
            // Don't index when not generating website or if index has not been set
            if (this.output.name != 'website' || !index || page.search === false) {
                return page;
            }

            this.log.debug.ln('index page', page.path);
            // Transform as text
            var text = page.content.replace(/(<([^>]+)>)/ig, '');

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