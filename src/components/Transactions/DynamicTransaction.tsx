import { TransactionWithBlock } from "../../near-api/types";
import { TxItemBase } from "./TxItemBase";
import { generateTransaction } from "../../library-tools/generator";
import { findComponent } from "../../library-tools/finder";

type Context = TransactionWithBlock;

export default function DynamicTransaction(props: { ctx: Context }) {
    // Find best match in the library
    const component = findComponent(props.ctx);

    let tx;

    if (component.type === "TransactionReactItem") {
        tx = component;
    } else {
        // Generate result from the content
        tx = generateTransaction(component, props.ctx);
    }

    return (
        <TxItemBase
            icon={tx.icon}
            hash={props.ctx.tx.hash}
            timestamp_nanosec={props.ctx.block.header.timestamp}
            color={tx.icon_color}
            title={tx.title}
            description={tx.description}
        />
    );
}
