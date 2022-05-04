{
"version": "",
// Description fields. Can be rendered using available variables
"title": {
"text": "",
"link": null
},
"short_description": "$input.msg->value",
"icon": {},
"extends": "",
"repository": "",
"homepage": "",
"documentation": "",

    // Extra description of the contract/transaction.
    "reference": "near://aurora/ft_metadata/",
    "reference_hash": "",

    // Filtering rules
    "filter_by": {},

    // Dynamic annotations.
    "schema": {
        "input": {},
        "output": {},
        "require": {},
        "description": {}
    },
    "variables": [
        {
            "name": "amount",
            "value": "$Nep141_Amount($token, $args.amount)"
        },
        {
            "name": "rec",
            "value": "$receipt[method:ft_transfer_call]"
        }
    ]

}

-- Introspection --
-- Reflection --

Goals of the DAO: - Approve users with whitelist access to the registry - Increase coverage of transactions in the registry - Visibility and funding - Help with development of mini-explorer - Propose changes on the Road-map (of registry and mini-explorer)

Use cases for the registry:

-   NEAR Explorers (explorer.near.org && nearblocks.io)
-   NEAR Telegram Bot that reports txs

registry.add_index(column, key, value, with_endorsement=true) {
hash := sha256({value})
registry.add_value(hash, value)
// make all relevant indexing information
}

// You can endorse only using the hash
registry.endorse(column, key, hash)
registry.remove_endorsement(column, key, hash)
registry.get_preferred_value(column, key) -> Option<Value>
data: List[Column]
Column: List[DataPoint]
DataPoint:
hash: Hash,
endorser: AccountId[],
fn recent_act
