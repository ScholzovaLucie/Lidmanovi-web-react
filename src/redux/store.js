import { configureStore } from "@reduxjs/toolkit";
import { apiApi } from "./api/apiApi";

export const store = configureStore({
  reducer: {
    [apiApi.reducerPath]: apiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiApi.middleware),
});
