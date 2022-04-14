import { configureStore } from "@reduxjs/toolkit";
import txReducer from "./actions/TxsAction";

const store = configureStore({
    reducer: {
        txs: txReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
