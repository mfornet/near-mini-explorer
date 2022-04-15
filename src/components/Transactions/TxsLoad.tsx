import { AccountId, TransactionWithBlock } from "../../near-api/types";
import TxsProgressBar from "./TxsProgressBar";
import TxsTimelime from "./TxsTimelime";
import savedData from "../../assets/savedData.json";
import { fetchTxs, IndexedTransaction } from "../../actions/TxsAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";

interface ProgressInterface {
    searched: number;
    rangeSize: number;
}

export default function TxsLoad(props: { accountId: AccountId }) {
    // const data = savedData as TransactionWithBlock[];
    const dispatch = useDispatch();

    const data = useSelector<RootState, IndexedTransaction[]>(
        (state) => state.txs.transactions
    );
    const progress = useSelector<RootState, ProgressInterface>(
        (state) => state.txs.activeSearch
    );

    useEffect(() => {
        dispatch(fetchTxs(props.accountId));
    }, [dispatch, props.accountId]);

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
