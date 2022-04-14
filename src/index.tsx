import React from "react";
import "./assets/index.css";
import App from "./components/App";
import reportWebVitals from "./utils/reportWebVitals";
import { Buffer } from "buffer";
import store from "./store";
import { Provider } from "react-redux";

import { createRoot } from "react-dom/client";

global.Buffer = Buffer;
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
