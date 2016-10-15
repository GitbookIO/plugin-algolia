const GitBook = require('gitbook-core');
const { React } = GitBook;

/**
 * Displays the default search results, but adds the Algolia logo.
 */
const AlgoliaResults = React.createClass({
    propTypes: {
        children: React.PropTypes.node
    },

    render() {
        return (
            <div>
                <GitBook.ImportCSS href="gitbook/algolia/style.css" />
                { this.props.children }
                <div className="Algolia">
                    Powered by <img className="Algolia-logo" src="gitbook/algolia/Algolia_logo_bg-white.svg" />
                </div>
            </div>
        );
    }
});

module.exports = AlgoliaResults;
