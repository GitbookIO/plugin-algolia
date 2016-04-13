# Power search using Algolia

Use Algolia as a back-end to index and search your book's content.

This plugins requires gitbook `>=3.0.0`.

## How to use it?

Sign up to Algolia and access your [API keys settings](https://www.algolia.com/api-keys). You will need your **Application ID**, **Search-Only API Key** and **Admin API Key**.

Add the plugin and its configuration to your `book.json`:

```JSON
{
    "plugins": ["algolia"],
    "pluginsConfig": {
        "algolia": {
            "index":         "whatever-name-for-your-index",
            "applicationID": "algolia-application-id",
            "publicKey":     "algolia-search-only-api-key"
        }
    }
}
```

Finally, pass your **Admin API Key** as an environment variable when launching gitbook, using `ALGOLIA_PRIVATEKEY`:

```Bash
$ ALGOLIA_PRIVATEKEY="algolia-admin-api-key" gitbook serve
```

#### A note about the index

As of Algolia's default behavior, you don't need to create the index manually before indexing your content.

Be cautious though that the plugin will replace your whole index at each build phase. If you choose to use an existing index, the plugin will utterly replace its content.