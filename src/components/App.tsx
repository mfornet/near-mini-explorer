import "../assets/App.css";
import { useParams } from "react-router-dom";
import Header from "./Header";
import TxsLoad from "./Transactions/TxsLoad";

function App() {
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
