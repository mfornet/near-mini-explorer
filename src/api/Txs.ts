import { genesisConfig, getStatus, viewAccessKeyList } from "../near-api/near";
import { AccountId, unwrap } from "../near-api/types";

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
        content = await viewAccessKeyList(accountId, height);
        if ("result" in content) {
            break;
        }
        console.log("Block not available:", { height });
        height -= 1;
    }

    const keys = unwrap(content).result.keys.map((key) => {
        return { publicKey: key.public_key, nonce: key.access_key.nonce };
    });

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

async function parallelBinarySearch(
    lo: number,
    hi: number,
    loVal: KeyState[] | null = null,
    hiVal: KeyState[] | null = null,
    compute: (position: number) => Promise<KeyState[]>,
    step: (position: number) => Promise<void>,
    delta: (delta: number) => void
) {
    if (loVal === null) {
        loVal = await compute(lo);
        delta(1);
        await step(lo);
    }

    if (hiVal === null) {
        hiVal = await compute(hi);
        delta(1);
    }

    if (equalKeyStates(loVal, hiVal)) {
        delta(hi - lo - 1);
        return;
    }

    if (lo + 1 === hi) {
        await step(hi);
        return;
    }

    const mid = Math.round((lo + hi) / 2);

    const midVal = await compute(mid);
    delta(1);

    const left = parallelBinarySearch(
        lo,
        mid,
        loVal,
        midVal,
        compute,
        step,
        delta
    );
    const right = parallelBinarySearch(
        mid,
        hi,
        midVal,
        hiVal,
        compute,
        step,
        delta
    );
    await Promise.all([left, right]);
}

export default async function downloadAccountIdTransaction(
    accountId: AccountId,
    // Callback to be called on each block `h`, such that keys are different between `h-1` and `h`
    stepCb: (block: number) => Promise<void>,
    initProgressCb: (delta: number) => void,
    deltaProgressCb: (delta: number) => void
): Promise<void> {
    const lo = (await genesisConfig()).result.genesis_height;
    const hi = (await getStatus()).result.sync_info.latest_block_height;

    initProgressCb(hi - lo + 1);
    await parallelBinarySearch(
        lo,
        hi,
        [],
        null,
        async (position) => {
            return getKeysState(accountId, position);
        },
        stepCb,
        deltaProgressCb
    );

    // Finish the progress
    deltaProgressCb(hi - lo + 1);
}
