import "./assets/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Buffer } from "buffer";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App";
import React from "react";
import reportWebVitals from "./utils/reportWebVitals";
import store from "./store";

global.Buffer = Buffer;
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path=":accountId" element={<App />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
