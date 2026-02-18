import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/pension/public",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    rooms: builder.query({
      query: () => "/rooms/",
    }),
  }),
});

export const { useRoomsQuery, useCreateReservationMutation } = roomsApi;
