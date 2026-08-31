import { configureStore } from "@reduxjs/toolkit";
import { apiApi } from "./api/apiApi";
import { authApi } from "./api/authApi";
import { roomsApi, adminRoomsApi, amenityIconsApi } from "./api/roomsApi";
import { reservationsApi } from "./api/reservationsApi";
import appReducer from "./slices/app/appSlice";
import reservationReducer from "./slices/reservation/reservationSlice";
import { guestApi } from "./api/guestApi";
import { cmsApi } from "./api/cmsApi";
import { announcementApi, announcementApiPublic } from "./api/announcementApi";
import { galleryApi } from "./api/galleryApi";
import { appSettingsApi } from "./api/appSettingsApi";
import { vouchersApi } from "./api/vouchersApi";

// Logger middleware only for explicit debug sessions.
const loggerMiddleware = () => (next) => (action) => {
  console.group(`🔄 Action: ${action.type}`);
  console.log("📋 Payload:", action.payload);
  console.log("🌐 State after:", store.getState());

  const result = next(action);
  console.groupEnd();

  return result;
};

const isReduxLoggerEnabled = import.meta.env.DEV && false;

export const store = configureStore({
  reducer: {
    app: appReducer,
    reservation: reservationReducer,
    [apiApi.reducerPath]: apiApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [roomsApi.reducerPath]: roomsApi.reducer,
    [adminRoomsApi.reducerPath]: adminRoomsApi.reducer,
    [amenityIconsApi.reducerPath]: amenityIconsApi.reducer,
    [reservationsApi.reducerPath]: reservationsApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [announcementApi.reducerPath]: announcementApi.reducer,
    [announcementApiPublic.reducerPath]: announcementApiPublic.reducer,
    [galleryApi.reducerPath]: galleryApi.reducer,
    [appSettingsApi.reducerPath]: appSettingsApi.reducer,
    [vouchersApi.reducerPath]: vouchersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        apiApi.middleware,
        authApi.middleware,
        roomsApi.middleware,
        adminRoomsApi.middleware,
        amenityIconsApi.middleware,
        reservationsApi.middleware,
        guestApi.middleware,
        cmsApi.middleware,
        announcementApi.middleware,
        announcementApiPublic.middleware,
        galleryApi.middleware,
        appSettingsApi.middleware,
        vouchersApi.middleware,
      )
      .concat(isReduxLoggerEnabled ? loggerMiddleware : []),
});
