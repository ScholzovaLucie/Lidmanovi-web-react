import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

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
          const exactPath = items.find((item) => {
            const itemPath = normalizePath(item?.path);
            return itemPath === targetPath;
          });
          if (!targetLang) return exactPath || null;

          const exact = items.find((item) => {
            const itemPath = normalizePath(item?.path);
            const itemLang = String(item?.lang || "").toLowerCase();
            return itemPath === targetPath && itemLang === targetLang;
          });
          return exact || exactPath || null;
        };

        // Preferred: backend returns one route record with all translations in content_json.
        const byPathResult = await baseQuery(
          {
            url: "/editorial_system/pages/",
            params: { path: arg.path },
          },
          api,
          extraOptions,
        );
        if (!byPathResult.error) {
          const byPathPick = pickMatching(byPathResult.data);
          if (byPathPick) return { data: byPathPick };
        }

        // Compatibility: older backend variants filtering by path + lang.
        const filteredResult = await baseQuery(
          {
            url: "/editorial_system/pages/",
            params: { path: arg.path, lang: arg.lang },
          },
          api,
          extraOptions,
        );
        if (!filteredResult.error) {
          const filteredPick = pickMatching(filteredResult.data);
          if (filteredPick) return { data: filteredPick };
        }

        const fallbackResult = await baseQuery(
          { url: "/editorial_system/pages/" },
          api,
          extraOptions,
        );
        if (fallbackResult.error) return { error: fallbackResult.error };

        return { data: pickMatching(fallbackResult.data) };
      },
      providesTags: (result, error, { path }) => [
        { type: "CmsPage", id: path },
      ],
    }),
    upsertCmsPage: builder.mutation({
      query: ({ path, lang, content_json }) => ({
        url: "/editorial_system/pages/upsert/",
        method: "PUT",
        params: lang ? { path, lang } : { path },
        body: lang ? { path, lang, content_json } : { path, content_json },
      }),
      invalidatesTags: (result, error, { path }) => [
        { type: "CmsPage", id: path },
      ],
    }),
  }),
});

export const { useGetCmsPageByRouteLangQuery, useUpsertCmsPageMutation } = cmsApi;
