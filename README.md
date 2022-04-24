# NEAR Mini Explorer

Serverless explorer for [NEAR](https://near.org/).

## Roadmap

-   [ ] Host service using web4.near.page
-   [ ] Save downloaded data using [IndexedDB](https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API)
        This will help to avoid downloading the same data multiple times. For each account select what was the last block downloaded and only start from there.
        Save common data from react components like FT metadata (etc...)
-   [ ] Add FAQ section (How does it work! How to contribute (to the code && to the parsed data)!)
-   [ ] Add search / filter functionality
-   [ ] Add support for multiple networks (mainnet,testnet)
-   [ ] Support fetching transactions descriptions from NEAR Blockchain (need to create a contract for this)
-   [ ] Add page to interact easily with contracts (view methods / state queries / change methods)
-   [ ] Make better invasive download policy (make only 100?? requests at a time)
    -   [ ] Prioritize most recent transactions first
    -   [ ] Update the progress bar depending on the percent of the prefix completed
