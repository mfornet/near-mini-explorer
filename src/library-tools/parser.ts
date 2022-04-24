import { AstParser } from "./ast";
import { Ast, ItemDefinition, TransactionItem } from "./types";

function buildElement(input: string, variables: Map<string, Ast>): Ast {
    const parser = new AstParser(input, variables);
    return parser.parse();
}

export function parseItem(content: ItemDefinition): TransactionItem {
    // Building variables for substitution
    const variables = new Map<string, Ast>();

    content.variables.forEach((variable) => {
        const result = buildElement(variable.value, variables);
        variables.set(variable.name, result);
    });

    return {
        type: "TransactionItem",
        title: buildElement(content.title, variables),
        mui_icon: content.mui_icon,
        input_schema: content.input_schema,
        description: buildElement(content.description, variables),
    };
}
