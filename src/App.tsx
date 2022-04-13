import { useEffect, useState } from "react";
import "./App.css";
import downloadAccountIdTransaction from "./txs";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class Downloader {
    current_value: number;
    last_value: number;
    data: number[];
    started: boolean;
    cb: null | ((data: number[]) => void);

    constructor() {
        this.current_value = 0;
        this.last_value = 10;
        this.data = [];
        this.started = false;
        this.cb = null;
    }

    async run() {
        while (this.current_value < this.last_value) {
            this.data.push(this.current_value);
            this.current_value += 1;
            console.log({
                value: this.current_value,
                data: this.data,
                cb: this.cb,
            });
            if (this.cb !== null) {
                this.cb(this.data);
            }
            await sleep(1000);
        }
    }

    mount(cb: (data: number[]) => void) {
        this.cb = cb;
        if (!this.started) {
            this.started = true;
            this.run();
        }
    }

    unmount() {
        this.cb = null;
    }
}

const downloader = new Downloader();
const globalIndex = [0];

function App() {
    globalIndex[0] += 1;

    const [data, setData] = useState([10, 20, 30]);
    const hookIndex = globalIndex[0];
    console.log("Rendering app", { hookIndex });

    useEffect(() => {
        console.log("Mounting", { setData, hookIndex });
        downloader.mount((data) => {
            console.log("Calling Hook", { hookIndex });
            setData(data);
        });
        return () => {
            console.log("Unmounting");
            downloader.unmount();
        };
    }, [hookIndex]);

    return (
        <div>
            <p>{downloader.data.toString()}</p>
            <ol>
                {data.map((value, index) => {
                    return <li key={index}>{value}</li>;
                })}
            </ol>
        </div>
    );
}

export default App;
