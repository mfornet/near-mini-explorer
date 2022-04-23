import Timeline from "@mui/lab/Timeline";
import { TransactionWithBlock } from "../../near-api/types";
import DynamicTransaction from "./DynamicTransaction";

export default function TxsTimelime(props: { txs: TransactionWithBlock[] }) {
    return (
        <Timeline>
            {props.txs.map((ctx, index) => (
                <DynamicTransaction key={index} ctx={ctx} />
            ))}
        </Timeline>
    );
}
