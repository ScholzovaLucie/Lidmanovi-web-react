import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withLanguageHeader } from "./language";

export const guestApi = createApi({
  reducerPath: "guestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/pension",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.auth.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return withLanguageHeader(headers);
    },
  }),
  endpoints: (builder) => ({
    guests: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: "/admin/guests/",
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
