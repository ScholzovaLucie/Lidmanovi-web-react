import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearAuth } from "./slices/app/appSlice";
import {
  storeTokens,
  clearTokens,
  getStoredTokens,
} from "../utils/cookieUtils";
import { withLanguageHeader } from "./api/language";

const baseUrl = "http://localhost:8000";

// Simple baseQuery without authentication
export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    return withLanguageHeader(headers);
  },
});

// BaseQuery with authentication but without automatic token refresh
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

// BaseQuery with authentication and automatic token refresh
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  // If request failed with 401, try to refresh token
  if (result.error?.status === 401) {
    const tokens = getStoredTokens();

    if (tokens.refresh) {
      // Try to refresh the token
      const refreshResult = await baseQueryWithAuth(
        {
          url: "/api/token/refresh/",
          method: "POST",
          body: { refresh: tokens.refresh },
        },
        api,
        extraOptions
      );

      if (refreshResult.data?.access) {
        // Successfully refreshed, store new tokens and retry
        const newTokens = {
          access: refreshResult.data.access,
          refresh: tokens.refresh,
        };
        storeTokens(newTokens.access, newTokens.refresh);
        api.dispatch(setTokens(newTokens));

        // Retry the original request
        result = await baseQueryWithAuth(args, api, extraOptions);
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
