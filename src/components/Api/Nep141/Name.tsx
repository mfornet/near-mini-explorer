import { useEffect, useState } from "react";
import { AccountId } from "../../../near-api/types";
import { persistentViewCall } from "../../../storage/contract";

export function Name(props: { token: AccountId }) {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        async function fetchName() {
            const result = await persistentViewCall(props.token, "ft_metadata");

            if (result === null) {
                setName("Name not available");
                return;
            }

            const metadata = JSON.parse(result.toString("utf8"));
            setName(metadata.name);
        }
        fetchName();
    });

    if (name === null) {
        return <span>??</span>;
    } else {
        return <span>{name}</span>;
    }
}
