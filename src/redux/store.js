import { configureStore } from "@reduxjs/toolkit";
import { apiApi } from "./api/apiApi";
import { roomsApi } from "./api/roomsApi";
import { reservationsApi } from "./api/reservationsApi";
import appReducer from "./slices/app/appSlice";
import reservationReducer from "./slices/reservation/reservationSlice";
import { guestApi } from "./api/guestApi";

// Logger middleware pro výpis stavu do konzole
const loggerMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState();

  console.group(`🔄 Action: ${action.type}`);
  console.log("📋 Payload:", action.payload);
  //console.log('⬅️ Previous State:', prevState);

  const result = next(action);

  const nextState = store.getState();
  console.log("➡️ Next State:", nextState);
  console.groupEnd();

  return result;
};

export const store = configureStore({
  reducer: {
    app: appReducer,
    reservation: reservationReducer,
    [apiApi.reducerPath]: apiApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiApi.middleware,
        roomsApi.middleware,
        reservationsApi.middleware,
        guestApi.middleware,
      )
      .concat(loggerMiddleware),
});
