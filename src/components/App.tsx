import "../assets/App.css";
import TxsLoad from "./Transactions/TxsLoad";

function App() {
    // TODO: Header with NEAR Logo and info from the user
    return (
        <div>
            <TxsLoad accountId="marcelo.near" />
        </div>
    );
}

export default App;
