import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withLanguageHeader } from "./language";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/pension/public",
  prepareHeaders: (headers) => {
    return withLanguageHeader(headers);
  },
});

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery,
  endpoints: (builder) => ({
    rooms: builder.query({
      query: () => "/rooms/",
    }),
    availableRooms: builder.query({
      query: ({ checkIn, checkOut, adults, children }) =>
        `/rooms/available-rooms/?adults=${adults}&children=${children}&from_date=${checkIn}&to_date=${checkOut}`,
    }),
  }),
});

export const { useRoomsQuery, useAvailableRoomsQuery } = roomsApi;
