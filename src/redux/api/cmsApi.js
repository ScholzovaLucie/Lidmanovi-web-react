import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearAuth } from "../slices/app/appSlice";
import {
  storeTokens,
  clearTokens,
  getStoredTokens,
} from "../../utils/cookieUtils";
import { withLanguageHeader } from "./language";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const tokens = getStoredTokens();

    if (tokens.refresh) {
      const refreshResult = await baseQuery(
        {
          url: "/api/token/refresh/",
          method: "POST",
          body: { refresh: tokens.refresh },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data?.access) {
        const newTokens = {
          access: refreshResult.data.access,
          refresh: tokens.refresh,
        };
        storeTokens(newTokens.access, newTokens.refresh);
        api.dispatch(setTokens(newTokens));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
        clearTokens();
      }
    } else {
      api.dispatch(clearAuth());
      clearTokens();
    }
  }

  return result;
};

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CmsPage"],
  endpoints: (builder) => ({
    getCmsPageByRouteLang: builder.query({
      async queryFn(arg, api, extraOptions, baseQuery) {
        const normalizePath = (value) => {
          if (!value) return "/";
          const raw = String(value).trim();
          if (raw === "/") return "/";
          return raw.endsWith("/") ? raw.slice(0, -1) : raw;
        };
        const pickMatching = (payload) => {
          const items = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.results)
              ? payload.results
              : payload
                ? [payload]
                : [];
          if (!items.length) return null;

          const targetPath = normalizePath(arg?.path);
          const targetLang = String(arg?.lang || "").toLowerCase();
          const exact = items.find((item) => {
            const itemPath = normalizePath(item?.path);
            const itemLang = String(item?.lang || "").toLowerCase();
            return itemPath === targetPath && itemLang === targetLang;
          });
          return exact || null;
        };

        const filteredResult = await baseQuery(
          {
            url: "/editorial_system/pages/",
            params: { path: arg.path, lang: arg.lang },
          },
          api,
          extraOptions,
        );
        if (filteredResult.error) return { error: filteredResult.error };

        const filteredPick = pickMatching(filteredResult.data);
        if (filteredPick) return { data: filteredPick };

        const fallbackResult = await baseQuery(
          { url: "/editorial_system/pages/" },
          api,
          extraOptions,
        );
        if (fallbackResult.error) return { error: fallbackResult.error };

        return { data: pickMatching(fallbackResult.data) };
      },
      providesTags: (result, error, { path, lang }) => [
        { type: "CmsPage", id: `${path}:${lang}` },
      ],
    }),
    upsertCmsPage: builder.mutation({
      query: ({ path, lang, content_json }) => ({
        url: "/editorial_system/pages/upsert/",
        method: "PUT",
        params: { path, lang },
        body: { path, lang, content_json },
      }),
      invalidatesTags: (result, error, { path, lang }) => [
        { type: "CmsPage", id: `${path}:${lang}` },
      ],
    }),
  }),
});

export const { useGetCmsPageByRouteLangQuery, useUpsertCmsPageMutation } = cmsApi;
