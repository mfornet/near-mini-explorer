import { Components } from "../components/Api";
import { HelpOutlineOutlined } from "@mui/icons-material";
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

function buildJsx(items: Ast2): JSX.Element {
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
                            {...reactComponentArgumentAsProps(item.arguments)}
                        />
                    );
                }
            })}
        </div>
    );
}

function buildFromAst(items: Ast, vars: Map<string, string>): JSX.Element {
    const items2 = populateSubstitutes(items, vars);
    return buildJsx(items2);
}

function parseJson(args: any, prefix: string, vars: Map<string, string>) {
    if (typeof args === "string") {
        vars.set(prefix, args);
    } else if (args instanceof Array) {
        // TODO:
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
            parseArguments(item.input_schema, action.FunctionCall.args, vars);
        }
    });

    vars.set("transaction.receiver_id", ctx.tx.receiver_id);

    // TODO: Make an icon finder
    const icon = <HelpOutlineOutlined />;

    return {
        type: "TransactionReactItem",
        title: buildFromAst(item.title, vars),
        icon_color: item.mui_icon.color || "grey",
        icon,
        description: buildFromAst(item.description, vars),
    };
}
