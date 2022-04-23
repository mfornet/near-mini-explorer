import { TransactionReactItem } from "../types";
import { HelpOutlineOutlined } from "@mui/icons-material";

export function unknownComponent(description: string): TransactionReactItem {
    return {
        type: "TransactionReactItem",
        title: <span>{"Unknown"}</span>,
        icon: <HelpOutlineOutlined />,
        icon_color: "grey",
        description: <div>{description}</div>,
    };
}
