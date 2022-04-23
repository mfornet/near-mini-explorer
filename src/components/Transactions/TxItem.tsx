import { getFunctionCallItem } from "../../library/library";
import { TxItemBase } from "./TxItemBase";
import { yoctoToNear } from "../../utils/format";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyIcon from "@mui/icons-material/Key";
import {
    isInstanceOfAddKey,
    isInstanceOfDeployContract,
    isInstanceOfFunctionCall,
    isInstanceOfTransfer,
    TransactionWithBlock,
} from "../../near-api/types";
import { FileUpload } from "@mui/icons-material";

// TODO: Create card with more information about each transaction
export default function TxItem(props: { tx: TransactionWithBlock }) {
    // TODO: Handle case of failed transactions
    const { tx, block } = props.tx;

    if (tx.actions.length === 0) {
        return (
            <TxItemBase
                icon={<HelpOutlineOutlinedIcon />}
                hash={tx.hash}
                color="grey"
                timestamp_nanosec={block.header.timestamp}
                title="Unknown"
                description="Number of actions equal 0"
            />
        );
    }

    if (tx.actions.length > 1) {
        return (
            <TxItemBase
                icon={<HelpOutlineOutlinedIcon />}
                hash={tx.hash}
                color="grey"
                timestamp_nanosec={block.header.timestamp}
                title="Unknown"
                description="Number of actions greater than one"
            />
        );
    }

    const action = tx.actions[0];

    if (isInstanceOfAddKey(action)) {
        if (action.AddKey.access_key.permission === "FullAccess") {
            return (
                <TxItemBase
                    icon={<KeyIcon />}
                    hash={tx.hash}
                    color="success"
                    timestamp_nanosec={block.header.timestamp}
                    title="Add Full Access Key"
                    description=""
                />
            );
        } else {
            const permission = action.AddKey.access_key.permission;

            return (
                <TxItemBase
                    icon={<KeyIcon />}
                    hash={tx.hash}
                    color="success"
                    timestamp_nanosec={block.header.timestamp}
                    title="Add Function Call Key"
                    description={`Contract: ${
                        permission.FunctionCall.receiver_id
                    } Allowance: ${yoctoToNear(
                        permission.FunctionCall.allowance
                    )} Ⓝ`}
                />
            );
        }
    } else if (isInstanceOfFunctionCall(action)) {
        const result = getFunctionCallItem(action, tx, block);

        if (result === null) {
            return (
                <TxItemBase
                    icon={<HelpOutlineOutlinedIcon />}
                    hash={tx.hash}
                    color="grey"
                    timestamp_nanosec={block.header.timestamp}
                    title="Unhandled Function Call"
                    description={`${tx.receiver_id}.${action.FunctionCall.method_name}()`}
                />
            );
        } else {
            return result;
        }
    } else if (isInstanceOfTransfer(action)) {
        return (
            <TxItemBase
                icon={<AttachMoneyIcon />}
                hash={tx.hash}
                color="primary"
                timestamp_nanosec={block.header.timestamp}
                title="Transfer"
                description={`Send ${yoctoToNear(
                    action.Transfer.deposit
                )} Ⓝ to ${tx.receiver_id}`}
            />
        );
    } else if (isInstanceOfDeployContract(action)) {
        return (
            <TxItemBase
                icon={<FileUpload />}
                hash={tx.hash}
                color="success"
                timestamp_nanosec={block.header.timestamp}
                title="Deploy Contract"
                description=""
            />
        );
    } else {
        return (
            <TxItemBase
                icon={<HelpOutlineOutlinedIcon />}
                hash={tx.hash}
                color="grey"
                timestamp_nanosec={block.header.timestamp}
                title="Unknown"
                description=""
            />
        );
    }
}
