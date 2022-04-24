import {
    HelpOutlineOutlined,
    CurrencyExchange,
    LocalPostOffice,
    HeartBroken,
    Looks,
} from "@mui/icons-material";

export function getIcon(name: string): JSX.Element {
    switch (name) {
        case "Looks":
            return <Looks />;
        case "CurrencyExchange":
            return <CurrencyExchange />;
        case "LocalPostOffice":
            return <LocalPostOffice />;
        case "HeartBroken":
            return <HeartBroken />;
        case "HelpOutlineOutlined":
            return <HelpOutlineOutlined />;
        default:
            return <HeartBroken />;
    }
}
