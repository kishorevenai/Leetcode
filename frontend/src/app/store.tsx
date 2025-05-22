import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../feature/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddlewar) =>
    getDefaultMiddlewar().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
