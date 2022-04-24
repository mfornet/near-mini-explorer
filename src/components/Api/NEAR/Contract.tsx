import { AccountId } from "../../../near-api/types";

export function Contract(props: { accountId: AccountId }) {
    let shortAccountId = props.accountId;

    if (shortAccountId.length === 64) {
        shortAccountId =
            shortAccountId.substring(0, 4) +
            "..." +
            shortAccountId.substring(shortAccountId.length - 4);
    }

    return (
        <span title={props.accountId}>
            <a href={`https://explorer.near.org/accounts/${props.accountId}`}>
                {shortAccountId}
            </a>
        </span>
    );
}
