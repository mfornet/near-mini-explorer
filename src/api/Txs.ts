import * as nearAPI from "near-api-js";
import { NearProtocolConfig } from "near-api-js/lib/providers/provider";
import NearRpcResult, { ViewAccessKeyList } from "../near-api/types";

type AccountId = string;

const OPTIONS = {
    networkId: "mainnet",
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://archival-rpc.mainnet.near.org/",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
    headers: {},
};

interface GensisConfigResponse extends NearProtocolConfig {
    genesis_height: number;
}

interface KeyState {
    publicKey: string;
    nonce: number;
}

async function getKeysState(
    accountId: AccountId,
    height: number
): Promise<KeyState[]> {
    let content;
    while (true) {
        const result = await fetch(
            new Request(OPTIONS.nodeUrl, {
                method: "post",
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: "dontcare",
                    method: "query",
                    params: {
                        request_type: "view_access_key_list",
                        block_id: height,
                        account_id: accountId,
                    },
                }),
                headers: { "Content-Type": "application/json" },
            })
        );

        content = await result.json();
        if (content.result !== undefined) {
            break;
        }
        console.log("Block not available:", { height });
        height -= 1;
    }

    const keys = (content as NearRpcResult<ViewAccessKeyList>).result.keys.map(
        (key) => {
            return { publicKey: key.public_key, nonce: key.access_key.nonce };
        }
    );

    keys.sort((a, b) => {
        if (a.publicKey === b.publicKey) return a.nonce < b.nonce ? -1 : +1;
        return a.publicKey < b.publicKey ? -1 : +1;
    });

    return keys;
}

function equalKeyStates(left: KeyState[], right: KeyState[]): boolean {
    if (left.length !== right.length) return false;

    for (let i = 0; i < left.length; i++) {
        if (left[i].publicKey !== right[i].publicKey) return false;
        if (left[i].nonce !== right[i].nonce) return false;
    }

    return true;
}

async function parallelSearch(
    lo: number,
    hi: number,
    loVal: KeyState[] | null = null,
    hiVal: KeyState[] | null = null,
    compute: (position: number) => Promise<KeyState[]>,
    step: (position: number) => Promise<void>
) {
    if (loVal === null) {
        loVal = await compute(lo);
        await step(lo);
    }

    if (hiVal === null) {
        hiVal = await compute(hi);
    }

    if (equalKeyStates(loVal, hiVal)) {
        return;
    }

    if (lo + 1 === hi) {
        await step(hi);
        return;
    }

    const mid = Math.round((lo + hi) / 2);

    const midVal = await compute(mid);

    const left = parallelSearch(lo, mid, loVal, midVal, compute, step);
    const right = parallelSearch(mid, hi, midVal, hiVal, compute, step);
    await Promise.all([left, right]);
}

export default async function downloadAccountIdTransaction(
    accountId: AccountId,
    cb: (block: number) => Promise<void>
): Promise<void> {
    const near = await nearAPI.connect(OPTIONS);
    const result = await near.connection.provider.experimental_genesisConfig();

    const lo = (result as GensisConfigResponse).genesis_height + 1000;
    const hi = (await near.connection.provider.status()).sync_info
        .latest_block_height;

    await parallelSearch(
        lo,
        hi,
        null,
        null,
        async (position) => {
            return getKeysState(accountId, position);
        },
        cb
    );
}
