import { U256 } from "../../../near-api/types";
import { yoctoToNear } from "../../../utils/format";

export function Token(props: { amount: U256 }) {
    return <span title={props.amount}>{yoctoToNear(props.amount)} Ⓝ</span>;
}
