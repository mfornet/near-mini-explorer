/// Find the proper component to use for a given transaction

import {
    Action,
    ActionAddKey,
    ActionTransfer,
    ActionFunctionCall,
    ActionDeployContract,
    isInstanceOfAddKey,
    isInstanceOfTransfer,
    TransactionWithBlock,
    isInstanceOfFunctionCall,
    isInstanceOfDeployContract,
} from "../../near-api/types";

import { TransactionItem, TransactionReactItem } from "../types";
import { unknownComponent } from "./unknown";
import { Contract, NearToken } from "../../components/Api/index";
import {
    FileUpload,
    AttachMoney,
    Key,
    QuestionAnswer,
} from "@mui/icons-material";

type ComponentDescription = TransactionItem | TransactionReactItem;

/**
 * Find the proper component to use for a given transaction on the library.
 *
 * @param ctx Context to find the component from
 * @returns The component description to use for the given transaction
 */
export function findComponent(ctx: TransactionWithBlock): ComponentDescription {
    // TODO: Check if the transaction was successful or not (this requires adding the receipt(s)? as part of the context)

    if (ctx.tx.actions.length === 1) {
        return findComponentFromAction(ctx, ctx.tx.actions[0]);
    } else {
        // TODO: Handle the case when the number of actions is !== 1
        return unknownComponent(
            `Transaction with ${ctx.tx.actions.length} actions`
        );
    }
}

function findComponentFromAction(
    ctx: TransactionWithBlock,
    action: Action
): ComponentDescription {
    // match action {}
    if (isInstanceOfTransfer(action)) {
        return findComponentFromTransfer(ctx, action);
    }

    if (isInstanceOfAddKey(action)) {
        return findComponentFromAddKey(ctx, action);
    }

    if (isInstanceOfFunctionCall(action)) {
        return findComponentFromFunctionCall(ctx, action);
    }

    if (isInstanceOfDeployContract(action)) {
        return findComponentFromDeployContract(ctx, action);
    }

    const actionType: string[] = [];
    for (let key in action as any) {
        actionType.push(key);
    }

    return unknownComponent("Unhandled action type: " + actionType.join(" "));
}

function findComponentFromTransfer(
    ctx: TransactionWithBlock,
    action: ActionTransfer
): TransactionReactItem {
    return {
        type: "TransactionReactItem",
        title: <span>{"Transfer"}</span>,
        icon: <AttachMoney />,
        icon_color: "primary",
        description: (
            <div>
                <span>{"Send "}</span>
                <NearToken amount={action.Transfer.deposit} />
                <span>{" to "}</span>
                <Contract accountId={ctx.tx.receiver_id} />
            </div>
        ),
    };
}

function findComponentFromAddKey(
    ctx: TransactionWithBlock,
    action: ActionAddKey
): TransactionReactItem {
    if (action.AddKey.access_key.permission === "FullAccess") {
        return {
            type: "TransactionReactItem",
            title: <span>{"Add Full Access Key"}</span>,
            icon: <Key />,
            icon_color: "success",
            description: <div></div>,
        };
    } else {
        const permission = action.AddKey.access_key.permission;
        return {
            type: "TransactionReactItem",
            title: <span>{"Add Function Call Key"}</span>,
            icon: <Key />,
            icon_color: "primary",
            description: (
                <div>
                    <span>{"Contract: "}</span>
                    <Contract accountId={permission.FunctionCall.receiver_id} />
                    <span>{" Allowance: "}</span>
                    <NearToken amount={permission.FunctionCall.allowance} />
                </div>
            ),
        };
    }
}

function findComponentFromFunctionCall(
    ctx: TransactionWithBlock,
    action: ActionFunctionCall
): ComponentDescription {
    // TODO: Try to find transaction from list
    //  Filter by: contract | contract.method | subcontract | subcontract.method | method

    return {
        type: "TransactionReactItem",
        title: <span>{"Function Call"}</span>,
        icon: <QuestionAnswer />,
        icon_color: "grey",
        description: (
            <div>
                <Contract accountId={ctx.tx.receiver_id} />
                <span>{`.${action.FunctionCall.method_name}()`}</span>
            </div>
        ),
    };
}

function findComponentFromDeployContract(
    ctx: TransactionWithBlock,
    action: ActionDeployContract
): TransactionReactItem {
    return {
        type: "TransactionReactItem",
        title: <span>{"Deploy Contract"}</span>,
        icon: <FileUpload />,
        icon_color: "success",
        description: <div></div>,
    };
}
