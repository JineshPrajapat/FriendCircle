import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import userNetworkReducer from "./reducers/userNetworkReducer"
const store = configureStore({
    reducer: {
        user: userReducer,
        userNetwork : userNetworkReducer
    },

});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;