import Typography from "@mui/material/Typography";
import LinearProgress, {
    LinearProgressProps,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function TxsProgressBar(props: {
    total: number;
    current: number;
}) {
    if (props.total === 0 || props.current >= props.total) {
        return <div></div>;
    }

    const ratio = props.current / props.total;
    const progress = Math.pow(ratio, 5);

    return (
        <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress * 100} />
        </Box>
    );
}
