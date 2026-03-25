import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../constants";

export const guestApi = createApi({
  reducerPath: "guestApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    guests: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: "/pension/admin/guests/",
        method: "GET",
        params: {
          page,
          page_size,
        },
      }),
    }),
  }),
});

export const { useGuestsQuery } = guestApi;
