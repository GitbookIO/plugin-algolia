# Power search using Algolia

Use Algolia as a back-end to index and search your book's content.

This plugins requires gitbook `>=3.0.0`.

## How to use it?

### Create an Algolia account

1. Sign up to [Algolia](https://www.algolia.com)
2. Set up a basic index.
3. Access your [API keys settings](https://www.algolia.com/api-keys), and leave this page open.

### Set up the plugin in your book.

1. Open Settings > Plugins Store interface in the Book Editor.
2. Install the `algolia` plugin.
3. Specify the following values in the modal for your book:
    * **Index ID**, which is the name of the index you set up in Algolia web.
    * **Application ID**, which is your unique application ID for API identification. 
    * **Search-only API Key**, which is the unique ID for search queries.
    * **Is your algoria account free**, which you leave as `true` if you have what Algoria call a "Hacker Account".

If you prefer, you can declare the plug-in values in the `book.json` file.

Add the plugin and its configuration to your `book.json`:

```JSON
{
    "plugins": ["algolia"],
    "pluginsConfig": {
        "algolia": {
            "index": "whatever-name-for-your-index",
            "applicationID": "algolia-application-id",
            "publicKey": "algolia-search-only-api-key"
            "freeAccount": "true"
        }
    }
}
```

### Set Algolia Environment Variables

If you are using the GitBook Editor, you specify the `ALGOLIA_PRIVATEKEY` in the Settings of your book.

1. Open https://www.gitbook.com/`@username]`/dashboard.
2. Select the book you want to add the environment variable to.
3. Click `Settings`.
4. Scroll down to the `Environment Variables` group.
5. Add the `ALGOLIA_PRIVATEKEY` value from your API Keys page.

If you are using the command line, pass your **Admin API Key** as an environment variable when launching gitbook, using `ALGOLIA_PRIVATEKEY`:

```Bash
$ ALGOLIA_PRIVATEKEY="algolia-admin-api-key" gitbook serve
```

#### A note about the index

**WARNING** The plugin will replace the entire index at each build phase. Do not use an existing index, unless you no longer require its contents.

When setting up the basic index on Algolia, you will be prompted to generate or import the index so Algolia can begin analysing your book.

You do not need to create the index manually for the plugin to work.

#### Exclude a page from indexing

You can remove a page from the indexing process by adding a YAML header to the page:

```md
---
search: false
---

# My Page

This page is not indexed in Algolia.
```
