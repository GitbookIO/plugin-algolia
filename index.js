const algoliasearch = require('algoliasearch');

let client = null;
let index = null;

module.exports = {
    hooks: {
        init() {
            // Don't index when not generating website
            if (this.output.name != 'website') return;

            // Check that private key has been provided
            if (!process.env.ALGOLIA_PRIVATEKEY) {
                this.log.warn.ln('Algolia indexation is disabled:');
                this.log.warn.ln('You need to configure the ALGOLIA_PRIVATEKEY environment variable using your Admin API Key.');
                return;
            }

            // Initialize Algolia client
            const config = this.config.get('pluginsConfig.algolia') || this.config.get('algolia');
            client = algoliasearch(config.applicationID, process.env.ALGOLIA_PRIVATEKEY);

            // Initialize index with book's title
            index = client.initIndex(config.index);

            // Clean index for updates
            return index.clearIndex()
            .then(function(content) {
                return index.waitTask(content.taskID);
            });
        },

        page(page) {
            const searchConfig = page.attributes.search;

            // Don't index when not generating website or if index has not been set
            if (this.output.name != 'website' || !index || searchConfig === false) {
                return page;
            }

            this.log.debug.ln('index page', page.path);
            const url = this.output.toURL(page.path);
            let keywords = [];
            if (searchConfig) {
                keywords = searchConfig.keywords || [];
            }
            // Transform as paragraphs
            const text = page.content.replace(/(<([^>]+)>)/ig, '');
            const lines = text.split(/\r\n|\n|\r/);
            const lineObjects = lines.map(line => ({
                url,
                path:  page.path,
                title: page.title,
                keywords,
                body:  line,
                level: page.level,
                depth: page.depth
              })
            );

            // Add to index
            return index.addObjects(lineObjects)
            .then(function() {
                return page;
            });
        }
    }
};
