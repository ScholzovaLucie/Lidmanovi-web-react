import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiApi = createApi({
  reducerPath: "apiApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    token: builder.mutation({
      query: ( {username, password }) => ({
        url: "/token/",
        method: "POST",
        body: { username, password },
      }),
    }),
  }),
});

export const { useTokenMutation } = apiApi;
