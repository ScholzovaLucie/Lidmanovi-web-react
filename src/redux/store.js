import { configureStore } from "@reduxjs/toolkit";
import { apiApi } from "./api/apiApi";
import { authApi } from "./api/authApi";
import { roomsApi, adminRoomsApi } from "./api/roomsApi";
import { reservationsApi } from "./api/reservationsApi";
import appReducer from "./slices/app/appSlice";
import reservationReducer from "./slices/reservation/reservationSlice";
import { guestApi } from "./api/guestApi";
import { cmsApi } from "./api/cmsApi";
import { announcementApi, announcementApiPublic } from "./api/announcementApi";

// Logger middleware only for explicit debug sessions.
const loggerMiddleware = () => (next) => (action) => {
  console.group(`🔄 Action: ${action.type}`);
  console.log("📋 Payload:", action.payload);
  console.log("🌐 State after:", store.getState());

  const result = next(action);
  console.groupEnd();

  return result;
};

const isReduxLoggerEnabled = true;

export const store = configureStore({
  reducer: {
    app: appReducer,
    reservation: reservationReducer,
    [apiApi.reducerPath]: apiApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [adminRoomsApi.reducerPath]: adminRoomsApi.reducer,
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [announcementApiPublic.reducerPath]: announcementApiPublic.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiApi.middleware,
        authApi.middleware,
        roomsApi.middleware,
        adminRoomsApi.middleware,
        reservationsApi.middleware,
        guestApi.middleware,
        cmsApi.middleware,
        announcementApi.middleware,
        announcementApiPublic.middleware,
      )
      .concat(isReduxLoggerEnabled ? loggerMiddleware : []),
});
