import { ColorType } from "../components/Transactions/TxItemBase";

type ItemType = "TransactionDescription";

export interface Filters {
    action_type?: string;
    method?: string;
    contract?: string;
    base_contract?: string;
}

export interface MuiIcon {
    name: string;
    color?: ColorType;
}

export interface Variable {
    name: string;
    value: string;
}

export interface ItemDefinition {
    type: ItemType;
    title: string;
    filter_by: Filters;
    mui_icon: MuiIcon;
    variables: Variable[];
    input_schema: InputSchema;
    description: string;
}

export interface InputSchema {
    type: "json" | "borsh" | "base64" | "hex" | "utf8" | "raw";
    schema?: any;
}

export interface TransactionItem {
    // TODO: remove type field
    type: "TransactionItem";
    title: Ast;
    mui_icon: MuiIcon;
    input_schema: InputSchema;
    description: Ast;
}

export interface TransactionReactItem {
    type: "TransactionReactItem";
    title: JSX.Element;
    icon: JSX.Element;
    icon_color: ColorType;
    description: JSX.Element;
}

export interface ReactComponentArgument {
    key: string;
    value: Ast;
}

export interface ReactComponent {
    name: string;
    arguments: ReactComponentArgument[];
}

export interface Substitute {
    key: string;
}

export type AstItem = string | ReactComponent | Substitute;
export type Ast = AstItem[];

export function isInstanceOfReactComponent(
    item: AstItem
): item is ReactComponent {
    if (typeof item !== "string") {
        return "name" in item;
    } else {
        return false;
    }
}

export function isInstanceOfSubstitute(item: AstItem): item is Substitute {
    if (typeof item !== "string") {
        return "key" in item;
    } else {
        return false;
    }
}

export interface ReactComponent2Argument {
    key: string;
    value: string;
}
export interface ReactComponent2 {
    name: string;
    arguments: ReactComponent2Argument[];
}
export type Ast2Item = string | ReactComponent2;
export type Ast2 = Ast2Item[];
