import { viewFunction } from "../near-api/near";
import { AccountId } from "../near-api/types";

export async function persistentViewCall(
    accountId: AccountId,
    methodName: string
): Promise<Buffer | null> {
    // TODO: Persist this information
    const output = await viewFunction(accountId, methodName, {});
    if ("result" in output) {
        return Buffer.from(output.result.result);
    } else {
        return null;
    }
}
