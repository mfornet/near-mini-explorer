import savedData from "../../assets/savedData.json";
import { AccountId, TransactionWithBlock } from "../../near-api/types";
import { fetchTxs, IndexedTransaction } from "../../actions/TxsAction";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import TxsProgressBar from "./TxsProgressBar";
import TxsTimelime from "./TxsTimelime";

const USE_OFFLINE_MODE = false;
interface ProgressInterface {
    searched: number;
    rangeSize: number;
}

export default function TxsLoad(props: { accountId: AccountId }) {
    const progress = useSelector<RootState, ProgressInterface>(
        (state) => state.txs.activeSearch
    );

    let data;

    if (USE_OFFLINE_MODE) {
        data = savedData as TransactionWithBlock[];
    } else {
        // eslint-disable-next-line
        const dispatch = useDispatch();
        // eslint-disable-next-line
        data = useSelector<RootState, IndexedTransaction[]>(
            (state) => state.txs.transactions
        );
        // eslint-disable-next-line
        useEffect(() => {
            dispatch(fetchTxs(props.accountId));
        }, [dispatch, props.accountId]);
    }

    // TODO: Account not found modal
    return (
        <div>
            <TxsProgressBar
                current={progress.searched}
                total={progress.rangeSize}
            />
            <TxsTimelime
                txs={data
                    .slice()
                    .reverse()
                    .map((iTx) => {
                        return {
                            tx: iTx.tx,
                            block: iTx.block,
                        };
                    })}
            />
        </div>
    );
}
