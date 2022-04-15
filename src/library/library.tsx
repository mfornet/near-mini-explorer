import { TxItemBase } from "../components/Transactions/TxItemBase";
import {
    AccountId,
    ActionFunctionCall,
    Block,
    Transaction,
    U256,
} from "../near-api/types";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

interface Context {
    action: ActionFunctionCall;
    tx: Transaction;
    block: Block;
}

const ContractMethod: { [key: string]: (ctx: Context) => JSX.Element } = {};

interface FtTransferCallArgs {
    amount: U256;
    msg: string;
    receiver_id: AccountId;
}

const Method: { [key: string]: (ctx: Context) => JSX.Element } = {
    ft_transfer_call: (ctx: Context) => {
        const argsRaw = Buffer.from(
            ctx.action.FunctionCall.args,
            "base64"
        ).toString("utf-8");

        // TODO: Handle case when the arguments are ill-formed
        const args = JSON.parse(argsRaw) as FtTransferCallArgs;

        // TODO: ReactComponent: **NEAR token** (give proper format to amount & allow copying to clipboard exact amount on click)
        // TODO: ReactComponent: **Token Name** (fetch the name of a token and display the proper name. Link to the account in NEAR Explorer)
        // TODO: ReactComponent: **Token Symbol** (same as Token Name)
        // TODO: ReactComponent: **Token Amount** Display properly formatted amount after having access to decimals
        // TODO: ReactComponent: **NEAR Account** (Add link to the account in mini-NEAR Explorer. Allow custom names)
        return (
            <TxItemBase
                icon={<CurrencyExchangeIcon />}
                hash={ctx.tx.hash}
                color="warning"
                timestamp_nanosec={ctx.block.header.timestamp}
                title="FT Transfer Call"
                description={`(${ctx.tx.receiver_id}) Receiver: ${args.receiver_id} Amount: ${args.amount}`}
            />
        );
    },
};

const Contract: { [key: string]: (ctx: Context) => JSX.Element } = {};

export function getFunctionCallItem(
    action: ActionFunctionCall,
    tx: Transaction,
    block: Block
): JSX.Element | null {
    const ctx: Context = { action, tx, block };

    const contractMethodKey = `${tx.receiver_id}.${action.FunctionCall.method_name}`;
    if (contractMethodKey in ContractMethod) {
        return ContractMethod[contractMethodKey](ctx);
    }

    const methodKey = `${action.FunctionCall.method_name}`;
    if (methodKey in Method) {
        return Method[methodKey](ctx);
    }

    const contractKey = `${tx.receiver_id}`;
    if (contractKey in Contract) {
        return Contract[contractKey](ctx);
    }

    return null;
}
