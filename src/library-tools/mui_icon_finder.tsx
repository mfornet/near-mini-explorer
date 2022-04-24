import { HelpOutlineOutlined, CurrencyExchange } from "@mui/icons-material";

export function getIcon(name: string): JSX.Element {
    switch (name) {
        case "CurrencyExchange":
            return <CurrencyExchange />;
        case "HelpOutlineOutlined":
            return <HelpOutlineOutlined />;
        default:
            return <HelpOutlineOutlined />;
    }
}
