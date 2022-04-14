import { AccountId } from "../../near-api/types";
import TxsProgressBar from "./TxsProgressBar";
import TxsTimelime from "./TxsTimelime";
import savedData from "../../assets/savedData.json";
import { IndexedTransaction } from "../../actions/TxsAction";

export default function TxsLoad(props: { accountId: AccountId }) {
    const data = savedData as IndexedTransaction[];
    // const dispatch = useDispatch();

    // const data = useSelector<RootState, IndexedTransaction[]>(
    //     (state) => state.txs.transactions
    // );

    // useEffect(() => {
    //     dispatch(fetchTxs("marcelo.near"));
    // }, [dispatch]);

    return (
        <div>
            <TxsProgressBar />
            <TxsTimelime txs={data.map((iTx) => iTx.tx)} />
        </div>
    );
}
