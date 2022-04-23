export type AccountId = string;
export type CryptoHash = string;
export type U256 = string;

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

export interface FunctionCallAccessKey {
    allowance: U256;
    method_names: string[];
    receiver_id: AccountId;
}
export interface FunctionCallAccessKeyOuter {
    FunctionCall: FunctionCallAccessKey;
}

export interface AccessKey {
    nonce: number;
    permission: "FullAccess" | FunctionCallAccessKeyOuter;
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

export interface BlockHeader {
    timestamp: number;
    timestamp_nanosec: string;
}

export interface Block {
    author: AccountId;
    chunks: BlockChunk[];
    header: BlockHeader;
}

export interface Receipt {
    predecessor_id: AccountId;
    receiver_id: AccountId;
}

export interface ActionTransfer {
    Transfer: {
        deposit: U256;
    };
}
export interface AddKey {
    access_key: AccessKey;
    public_key: CryptoHash;
}

export interface ActionAddKey {
    AddKey: AddKey;
}

export interface ActionFunctionCall {
    FunctionCall: {
        args: string;
        deposit: U256;
        gas: number;
        method_name: string;
    };
}
export interface ActionDeployContract {
    DeployContract: {
        code: string;
    };
}

export type Action =
    | ActionAddKey
    | ActionDeployContract
    | ActionFunctionCall
    | ActionTransfer;

export function isInstanceOfTransfer(action: Action): action is ActionTransfer {
    return "Transfer" in action;
}

export function isInstanceOfAddKey(action: Action): action is ActionAddKey {
    return "AddKey" in action;
}

export function isInstanceOfFunctionCall(
    action: Action
): action is ActionFunctionCall {
    return "FunctionCall" in action;
}

export function isInstanceOfDeployContract(
    action: Action
): action is ActionDeployContract {
    return "DeployContract" in action;
}

export interface Transaction {
    actions: Action[];
    hash: CryptoHash;
    nonce: number;
    public_key: CryptoHash;
    receiver_id: AccountId;
    signature: CryptoHash;
    signer_id: AccountId;
}

// TODO: Rename to Context
export interface TransactionWithBlock {
    tx: Transaction;
    block: Block;
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

export interface FunctionResult {
    block_hash: CryptoHash;
    block_height: number;
    logs: any[];
    result: number[];
}
