export default interface NearRpcResult<T> {
    id: string;
    jsonrpc: string;
    result: T;
}

export interface AccessKey {
    nonce: number;
    permission: any; // TODO
}

export interface Key {
    public_key: string;
    access_key: AccessKey;
}

export interface ViewAccessKeyList {
    block_hash: string;
    block_heigh: number;
    keys: Key[];
}
