import savedData from "../../assets/savedData.json";
import { AccountId, TransactionWithBlock } from "../../near-api/types";
import { fetchTxs, IndexedTransaction } from "../../actions/TxsAction";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import TxsProgressBar from "./TxsProgressBar";
import TxsTimelime from "./TxsTimelime";

interface ProgressInterface {
    searched: number;
    rangeSize: number;
}

export default function TxsLoad(props: { accountId: AccountId }) {
    const data = savedData as TransactionWithBlock[];
    // const dispatch = useDispatch();

    // const data = useSelector<RootState, IndexedTransaction[]>(
    //     (state) => state.txs.transactions
    // );

    const progress = useSelector<RootState, ProgressInterface>(
        (state) => state.txs.activeSearch
    );

    // useEffect(() => {
    //     dispatch(fetchTxs(props.accountId));
    // }, [dispatch, props.accountId]);

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
                    .slice(0, 50)
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
