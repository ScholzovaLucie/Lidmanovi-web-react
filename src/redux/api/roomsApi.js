import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withLanguageHeader } from "./language";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/pension/public",
  prepareHeaders: (headers) => {
    return withLanguageHeader(headers);
  },
});

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

export const roomsApi = createApi({
  reducerPath: "roomsApi",
  baseQuery,
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    rooms: builder.query({
      query: () => "/rooms/",
      providesTags: ["Room"],
    }),
    availableRooms: builder.query({
      query: ({ checkIn, checkOut, adults, children }) =>
        `/rooms/available-rooms/?adults=${adults}&children=${children}&from_date=${checkIn}&to_date=${checkOut}`,
    }),
  }),
});

export const adminRoomsApi = createApi({
  reducerPath: "adminRoomsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Room"],
  endpoints: (builder) => ({
    adminRooms: builder.query({
      query: ({ page = 1, page_size = 10, lang } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: page_size.toString(),
        });
        if (lang) {
          params.append("lang", lang);
        }
        return `/pension/public/rooms/?${params.toString()}`;
      },
      providesTags: ["Room"],
    }),
    updateRoom: builder.mutation({
      query: ({ id, ...roomData }) => ({
        url: `/pension/admin/rooms/${id}/`,
        method: "PUT",
        body: roomData,
      }),
      invalidatesTags: ["Room"],
    }),
  }),
});

export const { useRoomsQuery, useAvailableRoomsQuery } = roomsApi;

export const { useAdminRoomsQuery, useUpdateRoomMutation } = adminRoomsApi;
