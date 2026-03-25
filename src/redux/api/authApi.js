import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/api/token/",
        method: "POST",
        body: { username, password },
      }),
    }),
    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "/api/token/refresh/",
        method: "POST", 
        body: { refresh },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
