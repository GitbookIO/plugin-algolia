const GitBook = require('gitbook-core');
const { React } = GitBook;

/**
 * Displays the default search results, but adds the Algolia logo.
 */
const AlgoliaResults = React.createClass({
    propTypes: {
        file: GitBook.PropTypes.File.isRequired,
        children: React.PropTypes.node
    },

    render() {
        const { file, children } = this.props;

        return (
            <div>
                <GitBook.ImportCSS href="gitbook/algolia/style.css" />
                { children }
                <div className="Algolia">
                    <a href="https://www.algolia.com/">
                        Powered by <img className="Algolia-logo"
                                        src={file.relative('gitbook/algolia/Algolia_logo_bg-white.svg')} />
                    </a>
                </div>
            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        file: state.file
    };
}


module.exports = GitBook.connect(AlgoliaResults, mapStateToProps);
