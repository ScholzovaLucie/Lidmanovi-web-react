import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/pension/public",
  }),
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
