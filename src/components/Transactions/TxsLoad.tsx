import { AccountId } from "../../near-api/types";
import TxsProgressBar from "./TxsProgressBar";
import TxsTimelime from "./TxsTimelime";

export default function TxsLoad(props: { accountId: AccountId }) {
    // const dispatch = useDispatch();

    // const data = useSelector<RootState, IndexedTransaction[]>(
    //     (state) => state.txs.transactions
    // );

    // console.log(JSON.stringify(data));

    // useEffect(() => {
    //     dispatch(fetchTxs("marcelo.near"));
    // }, [dispatch]);

    return (
        <div>
            <TxsProgressBar />
            <TxsTimelime />
        </div>
    );
}
