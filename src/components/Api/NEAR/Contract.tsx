import { AccountId } from "../../../near-api/types";

export function Contract(props: { accountId: AccountId }) {
    /// Link to the real account
    return (
        <span>
            <a href={`https://explorer.near.org/accounts/${props.accountId}`}>
                {props.accountId}
            </a>
        </span>
    );
}
