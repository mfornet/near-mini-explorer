import { CryptoHash } from "../../near-api/types";
import { Link } from "@mui/material";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Typography from "@mui/material/Typography";

export type ColorType =
    | "inherit"
    | "grey"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";

export function TxItemBase(props: {
    hash: CryptoHash;
    timestamp_nanosec: number;
    color: ColorType;
    icon: JSX.Element;
    title: string | JSX.Element;
    description: string | JSX.Element;
}) {
    return (
        <TimelineItem>
            <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color=""
            >
                <Link
                    href={`https://explorer.near.org/transactions/${props.hash}`}
                >
                    {new Date(
                        props.timestamp_nanosec / 1000000
                    ).toLocaleString()}
                </Link>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color={props.color}>{props.icon}</TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="h6" component="span">
                    {props.title}
                </Typography>
                <Typography component="span">{props.description}</Typography>
            </TimelineContent>
        </TimelineItem>
    );
}
