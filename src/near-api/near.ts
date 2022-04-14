import NearRpcResult, { Block, Chunk } from "./types";

const NODE_URL = "https://archival-rpc.mainnet.near.org/";

async function nearFetch<T>(
    method: string,
    params: any
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

export async function getBlock(
    blockHeight: number
): Promise<NearRpcResult<Block>> {
    return await nearFetch<Block>("block", { block_id: blockHeight });
}

export async function getChunk(chunkId: string): Promise<NearRpcResult<Chunk>> {
    return await nearFetch<Chunk>("chunk", { chunk_id: chunkId });
}
