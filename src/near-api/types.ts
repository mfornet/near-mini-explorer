export type AccountId = string;
export type CryptoHash = string;

export default interface NearRpcResult<T> {
    id: AccountId;
    jsonrpc: string;
    result: T;
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
