import Timeline from "@mui/lab/Timeline";
import { TransactionWithBlock } from "../../near-api/types";
import TxItem from "./TxItem";

export default function TxsTimelime(props: { txs: TransactionWithBlock[] }) {
    return (
        <Timeline>
            {props.txs.map((tx, index) => (
                <TxItem key={index} tx={tx} />
            ))}
        </Timeline>
    );
}
