import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../constants";

export const apiApi = createApi({
  reducerPath: "apiApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    token: builder.mutation({
      query: ( {username, password }) => ({
        url: "/api/token/",
        method: "POST",
        body: { username, password },
      }),
    }),
  }),
});

export const { useTokenMutation } = apiApi;
