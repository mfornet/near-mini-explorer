import "../assets/App.css";
import { useParams } from "react-router-dom";
import Header from "./Header";
import TxsLoad from "./Transactions/TxsLoad";
// import DynamicTransaction from "./Transactions/DynamicTransaction";
// import savedData from "../assets/savedData.json";
// import { TransactionWithBlock } from "../near-api/types";

function App() {
    // const data = savedData as TransactionWithBlock[];
    const params = useParams();
    const accountId = params.accountId || "Select an account";

    return (
        <div>
            <Header accountId={accountId} />
            <TxsLoad accountId={accountId} />
        </div>
    );
}

export default App;
