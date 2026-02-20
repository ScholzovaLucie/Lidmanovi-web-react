import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const guestApi = createApi({
  reducerPath: "guestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/pension",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    guests: builder.query({
      query: () => "/admin/guests/",
      method: "GET",
    }),
  }),
});

export const { useGuestsQuery } = guestApi;
