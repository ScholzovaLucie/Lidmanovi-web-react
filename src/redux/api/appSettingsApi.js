import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithReauth } from "../constants";

const appSettingsBaseQuery = (args, api, extraOptions) =>
  args.method === "GET"
    ? baseQuery(args, api, extraOptions)
    : baseQueryWithReauth(args, api, extraOptions);

export const appSettingsApi = createApi({
  reducerPath: "appSettingsApi",
  baseQuery: appSettingsBaseQuery,
  tagTypes: ["AppSettings"],
  endpoints: (builder) => ({
    getAppSettings: builder.query({
      query: () => ({
        url: "/app-settings/",
        method: "GET",
      }),
      providesTags: ["AppSettings"],
    }),

    upsertAppSetting: builder.mutation({
      query: ({ key, value }) => ({
        url: "/app-settings/",
        method: "POST",
        body: { key, value },
      }),
      invalidatesTags: ["AppSettings"],
    }),
  }),
});

export const { useGetAppSettingsQuery, useUpsertAppSettingMutation } =
  appSettingsApi;
