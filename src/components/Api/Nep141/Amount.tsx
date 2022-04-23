import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { AccountId } from "../../../near-api/types";
import { persistentViewCall } from "../../../storage/contract";

const EXTRA_DECIMALS = 2;

export function Amount(props: { token: AccountId; amount: string }) {
    const [decimals, setDecimals] = useState<number>(0);

    useEffect(() => {
        async function fetchName() {
            const result = await persistentViewCall(props.token, "ft_metadata");

            if (result === null) {
                return;
            }

            const metadata = JSON.parse(result.toString("utf8"));
            setDecimals(metadata.decimals);
        }
        fetchName();
    });

    let amount_bn = new BigNumber(props.amount);
    const extra_decimals = Math.min(EXTRA_DECIMALS, decimals);

    amount_bn = amount_bn.div(new BigNumber(10).pow(decimals - extra_decimals));

    return (
        <span>
            {(amount_bn.toNumber() / 10 ** extra_decimals).toFixed(
                extra_decimals
            )}
        </span>
    );
}
