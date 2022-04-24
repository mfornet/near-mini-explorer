import { Components } from "../components/Api";
import {
    TransactionWithBlock,
    isInstanceOfFunctionCall,
} from "../near-api/types";
import {
    Ast,
    Ast2,
    isInstanceOfReactComponent,
    isInstanceOfSubstitute,
    TransactionItem,
    TransactionReactItem,
    ReactComponent2Argument,
    InputSchema,
} from "./types";
import { collapseString } from "./ast";
import { getIcon } from "./mui_icon_finder";

function reactComponentArgumentAsProps(args: ReactComponent2Argument[]): any {
    const props: any = {};
    args.forEach((arg) => {
        props[arg.key] = arg.value;
    });
    return props;
}

function populateSubstitutes(items: Ast, vars: Map<string, string>): Ast2 {
    return items.map((item) => {
        if (isInstanceOfSubstitute(item)) {
            return vars.get(item.key) || `<${item.key}>`;
        } else if (isInstanceOfReactComponent(item)) {
            return {
                name: item.name,
                arguments: item.arguments.map((arg) => {
                    return {
                        key: arg.key,
                        value: collapseString(
                            populateSubstitutes(arg.value, vars)
                        ),
                    };
                }),
            };
        } else {
            return item;
        }
    });
}

function buildJsx(items: Ast2, ctx: TransactionWithBlock): JSX.Element {
    return (
        <div>
            {items.map((item, index) => {
                if (typeof item === "string") {
                    return <span key={index}>{item}</span>;
                } else {
                    const Component = Components.get(item.name);
                    if (Component === undefined) {
                        return <span key={index}>[{item.name}]</span>;
                    }
                    return (
                        <Component
                            key={index}
                            ctx={ctx}
                            {...reactComponentArgumentAsProps(item.arguments)}
                        />
                    );
                }
            })}
        </div>
    );
}

function buildFromAst(
    items: Ast,
    vars: Map<string, string>,
    ctx: TransactionWithBlock
): JSX.Element {
    const items2 = populateSubstitutes(items, vars);
    return buildJsx(items2, ctx);
}

// TODO: Instead of parsing the whole json directly, from the beginning, create `function projectJson(args, key) that fetches data from args based on key
// For example projectJson({value: {total: [1, 2, 3]}}, ".value.total[2]") should return 3
function parseJson(args: any, prefix: string, vars: Map<string, string>) {
    if (typeof args === "string") {
        vars.set(prefix, args);
    } else if (args instanceof Array) {
    } else if (typeof args === "object") {
        for (let key in args) {
            parseJson(args[key], `${prefix}.${key}`, vars);
        }
    }
}

function parseArguments(
    inputSchema: InputSchema,
    argsBase64: string,
    vars: Map<string, string>
) {
    const argsRaw = Buffer.from(argsBase64, "base64");

    if (inputSchema.type === "json") {
        const args = JSON.parse(argsRaw.toString("utf8"));
        parseJson(args, "args", vars);
    } else if (inputSchema.type === "raw") {
        vars.set("args", argsRaw.toString("utf8"));
    } else {
        console.log("Unsupported type", inputSchema.type);
    }
}

export function generateTransaction(
    item: TransactionItem,
    ctx: TransactionWithBlock
): TransactionReactItem {
    const vars = new Map<string, string>();

    // Parse arguments from Function Calls
    ctx.tx.actions.forEach((action) => {
        if (isInstanceOfFunctionCall(action)) {
            vars.set("transaction.deposit", action.FunctionCall.deposit);
            parseArguments(item.input_schema, action.FunctionCall.args, vars);
        }
    });

    vars.set("transaction.receiver_id", ctx.tx.receiver_id);

    const icon = getIcon(item.mui_icon.name);

    return {
        type: "TransactionReactItem",
        title: buildFromAst(item.title, vars, ctx),
        icon_color: item.mui_icon.color || "grey",
        icon,
        description: buildFromAst(item.description, vars, ctx),
    };
}
