import { useEffect, useState } from "react";
import { AccountId } from "../../../near-api/types";
import { persistentViewCall } from "../../../storage/contract";

export function Symbol(props: { token: AccountId }) {
    const [symbol, setSymbol] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSymbol() {
            const result = await persistentViewCall(props.token, "ft_metadata");

            if (result === null) {
                setSymbol("Symbol not available");
                return;
            }

            const metadata = JSON.parse(result.toString("utf8"));
            setSymbol(metadata.symbol);
        }
        fetchSymbol();
    });

    if (symbol === null) {
        return <span>??</span>;
    } else {
        return <span>{symbol}</span>;
    }
}
