import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withLanguageHeader } from "./language";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

export const apiApi = createApi({
  reducerPath: "apiApi",
  baseQuery: baseQueryWithAuth,
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
