export type AccountId = string;
export type CryptoHash = string;

export interface NearRpcResultOk<T> {
    id: AccountId;
    jsonrpc: string;
    result: T;
}

export interface NearRpcResultError {
    id: AccountId;
    jsonrpc: string;
    error: any | undefined;
}

// TODO: Use Result / Either
export type NearRpcResult<T> = NearRpcResultOk<T> | NearRpcResultError;

export function unwrap<T>(result: NearRpcResult<T>): NearRpcResultOk<T> {
    if ("result" in result) {
        return result as NearRpcResultOk<T>;
    } else {
        throw new Error(`Unexpected result: ${JSON.stringify(result)}`);
    }
}
export interface GenesisConfig {
    genesis_height: number;
}

export interface AccessKey {
    nonce: number;
    permission: any;
}

export interface Key {
    public_key: CryptoHash;
    access_key: AccessKey;
}

export interface ViewAccessKeyList {
    block_hash: CryptoHash;
    block_heigh: number;
    keys: Key[];
}

export interface BlockChunk {
    chunk_hash: CryptoHash;
}

export interface Block {
    author: AccountId;
    chunks: BlockChunk[];
}

export interface Receipt {
    predecessor_id: AccountId;
    receiver_id: AccountId;
}

export interface Transaction {
    receiver_id: AccountId;
    signer_id: AccountId;
    hash: CryptoHash;
}

export interface Chunk {
    receipts: Receipt[];
    transactions: Transaction[];
}

export interface SyncInfo {
    latest_block_height: number;
}

export interface Status {
    sync_info: SyncInfo;
}
