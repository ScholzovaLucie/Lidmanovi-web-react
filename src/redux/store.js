import { configureStore } from "@reduxjs/toolkit";
import { apiApi } from "./api/apiApi";
import { authApi } from "./api/authApi";
import { roomsApi } from "./api/roomsApi";
import { reservationsApi } from "./api/reservationsApi";
import appReducer from "./slices/app/appSlice";
import reservationReducer from "./slices/reservation/reservationSlice";
import { guestApi } from "./api/guestApi";
import { cmsApi } from "./api/cmsApi";

// Logger middleware only for explicit debug sessions.
const loggerMiddleware = () => (next) => (action) => {
  console.group(`🔄 Action: ${action.type}`);
  console.log("📋 Payload:", action.payload);

  const result = next(action);
  console.groupEnd();

  return result;
};

const isReduxLoggerEnabled =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_REDUX_LOGGER === "true";

export const store = configureStore({
  reducer: {
    app: appReducer,
    reservation: reservationReducer,
    [apiApi.reducerPath]: apiApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiApi.middleware,
        authApi.middleware,
        roomsApi.middleware,
        reservationsApi.middleware,
        guestApi.middleware,
        cmsApi.middleware,
      )
      .concat(isReduxLoggerEnabled ? loggerMiddleware : []),
});
