import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearAuth } from "../slices/app/appSlice";
import { storeTokens, clearTokens, getStoredTokens } from "../../utils/cookieUtils";
import { withLanguageHeader } from "./language";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If request failed with 401, try to refresh token
  if (result.error?.status === 401) {
    const tokens = getStoredTokens();
    
    if (tokens.refresh) {
      // Try to refresh the token
      const refreshResult = await baseQuery({
        url: '/token/refresh/',
        method: 'POST',
        body: { refresh: tokens.refresh },
      }, api, extraOptions);

      if (refreshResult.data?.access) {
        // Successfully refreshed, store new tokens and retry
        const newTokens = { access: refreshResult.data.access, refresh: tokens.refresh };
        storeTokens(newTokens.access, newTokens.refresh);
        api.dispatch(setTokens(newTokens));
        
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch(clearAuth());
        clearTokens();
      }
    } else {
      // No refresh token, logout
      api.dispatch(clearAuth());  
      clearTokens();
    }
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "/token/",
        method: "POST",
        body: { username, password },
      }),
    }),
    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "/token/refresh/",
        method: "POST", 
        body: { refresh },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApi;
