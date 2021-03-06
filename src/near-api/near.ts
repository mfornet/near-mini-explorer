import {
    NearRpcResult,
    Block,
    Chunk,
    ViewAccessKeyList,
    unwrap,
    NearRpcResultOk,
    GenesisConfig,
    Status,
    FunctionResult,
    AccountId,
} from "./types";

const NODE_URL = "https://archival-rpc.mainnet.near.org/";

async function nearFetch<T>(
    method: string,
    params: any = null
): Promise<NearRpcResult<T>> {
    const result = await fetch(
        new Request(NODE_URL, {
            method: "post",
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: "dontcare",
                method,
                params,
            }),
            headers: { "Content-Type": "application/json" },
        })
    );
    return (await result.json()) as NearRpcResult<T>;
}

// TODO: Remove method after return rust::Result
async function nearFetchOk<T>(
    method: string,
    params: any = null
): Promise<NearRpcResultOk<T>> {
    const result = await nearFetch<T>(method, params);
    return unwrap(result);
}

export async function getBlock(
    blockHeight: number
): Promise<NearRpcResultOk<Block>> {
    return await nearFetchOk<Block>("block", { block_id: blockHeight });
}

export async function getChunk(
    chunkId: string
): Promise<NearRpcResultOk<Chunk>> {
    return await nearFetchOk<Chunk>("chunk", { chunk_id: chunkId });
}

export async function viewAccessKeyList(
    accountId: string,
    blockHeight: number
): Promise<NearRpcResult<ViewAccessKeyList>> {
    return await nearFetch<ViewAccessKeyList>("query", {
        request_type: "view_access_key_list",
        block_id: blockHeight,
        account_id: accountId,
    });
}

export async function genesisConfig(): Promise<NearRpcResultOk<GenesisConfig>> {
    return await nearFetchOk<GenesisConfig>("EXPERIMENTAL_genesis_config");
}

export async function getStatus(): Promise<NearRpcResultOk<Status>> {
    return await nearFetchOk<Status>("status", []);
}

export async function viewFunction(
    accountId: AccountId,
    methodName: string,
    args: undefined | string | Buffer | any
): Promise<NearRpcResult<FunctionResult>> {
    // Make a best effort to encode args
    let args_base64;
    if (args === undefined) {
        args_base64 = Buffer.from([]);
    } else if (typeof args === "string") {
        args_base64 = Buffer.from(args, "utf-8");
    } else if (Buffer.isBuffer(args)) {
        args_base64 = args;
    } else {
        args_base64 = Buffer.from(JSON.stringify(args));
    }

    return await nearFetch<FunctionResult>("query", {
        request_type: "call_function",
        finality: "final",
        account_id: accountId,
        method_name: methodName,
        args_base64: args_base64.toString("base64"),
    });
}
