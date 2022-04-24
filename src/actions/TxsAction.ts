import { Block, Transaction } from "../near-api/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlock, getChunk } from "../near-api/near";
import { RootState } from "../store";
import downloadAccountIdTransaction from "../api/txs";

export interface IndexedTransaction {
    tx: Transaction;
    block: Block;
    blockHeight: number;
    index: number;
}

function key(tx: IndexedTransaction) {
    return tx.blockHeight * 1000 + tx.index;
}

export const counterSlice = createSlice({
    name: "transactions",
    initialState: {
        activeSearch: {
            active: false,
            lastBlock: 0,
            started: 0,
            searched: 0,
            rangeSize: 0,
        },
        transactions: [] as IndexedTransaction[],
    },
    reducers: {
        newTransaction: (state, action: { payload: IndexedTransaction }) => {
            state.transactions.push(action.payload);
            state.transactions.sort((a, b) => key(a) - key(b));
        },
        start: (state, action: { payload: number }) => {
            state.activeSearch.lastBlock = action.payload;
            state.activeSearch.started = Date.now();
            state.activeSearch.active = true;
        },
        updateProgress: (state, action: { payload: number }) => {
            if (state.activeSearch.rangeSize === 0) {
                state.activeSearch.rangeSize = action.payload;
            } else {
                state.activeSearch.searched += action.payload;
            }
        },
        finish: (state) => {
            state.activeSearch.active = false;
        },
    },
});

export const { newTransaction, start, finish, updateProgress } =
    counterSlice.actions;

export default counterSlice.reducer;

export const fetchTxs = createAsyncThunk(
    "transactions/fetchTxs",
    async (accountId: string, thunkAPI: any) => {
        const state: RootState = thunkAPI.getState();

        if (state.txs.activeSearch.active) {
            return;
        }

        thunkAPI.dispatch(start(1));
        await downloadAccountIdTransaction(
            accountId,
            async (blockHeight) => {
                getBlock(blockHeight).then(async (block_) => {
                    const block = block_.result;
                    const chunks = await Promise.all(
                        block.chunks.map(async (chunk) => {
                            return await getChunk(chunk.chunk_hash);
                        })
                    );

                    chunks
                        .map((chunk) => chunk.result)
                        .forEach((chunk) => {
                            chunk.transactions.forEach((tx, index) => {
                                if (
                                    tx.signer_id === accountId ||
                                    tx.receiver_id === accountId
                                ) {
                                    thunkAPI.dispatch(
                                        newTransaction({
                                            tx,
                                            block,
                                            blockHeight,
                                            index,
                                        })
                                    );
                                }
                            });
                        });
                });
            },
            (delta) => {
                thunkAPI.dispatch(updateProgress(delta));
            },
            (delta) => {
                thunkAPI.dispatch(updateProgress(delta));
            }
        );
        thunkAPI.dispatch(finish());
    }
);
