import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CmsPage", "CmsPageTranslation"],
  endpoints: (builder) => ({
    getCmsPageByRouteLang: builder.query({
      query: ({ path, lang }) => ({
        url: "/editorial_system/pages/",
        params: { path, lang },
      }),
      transformResponse: (payload) => {
        const items = Array.isArray(payload) ? payload : payload?.results || [];
        return items[0] || null;
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
    upsertCmsPageTranslation: builder.mutation({
      query: ({ pageId, lang, content_json }) => ({
        url: `/editorial_system/pages/${pageId}/translations/`,
        method: "PATCH",
        body: { lang, content_json },
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: "CmsPageTranslation", id: pageId },
      ],
    }),
  }),
});

export const {
  useGetCmsPageByRouteLangQuery,
  useUpsertCmsPageMutation,
  useUpsertCmsPageTranslationMutation,
} = cmsApi;
