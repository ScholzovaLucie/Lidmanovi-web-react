import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { withLanguageHeader } from "./language";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://localhost:8000/editorial_system/info-boxes",
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = getState().app.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return withLanguageHeader(headers);
  },
});

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["InfoBox"],
  endpoints: (builder) => ({
    // GET /editorial_system/info-boxes/ - seznam info boxů s paginací
    getInfoBoxes: builder.query({
      query: ({ page = 1, page_size = 10, lang } = {}) => ({
        url: "/",
        method: "GET",
        params: {
          page,
          page_size,
          ...(lang && { lang }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: "InfoBox", id })),
              { type: "InfoBox", id: "LIST" },
            ]
          : [{ type: "InfoBox", id: "LIST" }],
    }),

    // GET /editorial_system/info-boxes/{id}/ - detail info boxu
    getInfoBox: builder.query({
      query: ({ id, lang }) => ({
        url: `/${id}/`,
        method: "GET",
        params: {
          ...(lang && { lang }),
        },
      }),
      providesTags: (result, error, { id }) => [{ type: "InfoBox", id }],
    }),

    // POST /editorial_system/info-boxes/ - vytvoření nového info boxu
    createInfoBox: builder.mutation({
      query: (newInfoBox) => ({
        url: "/",
        method: "POST",
        body: newInfoBox,
      }),
      invalidatesTags: [{ type: "InfoBox", id: "LIST" }],
    }),

    // DELETE /editorial_system/info-boxes/{id}/ - smazání info boxu
    deleteInfoBox: builder.mutation({
      query: (id) => ({
        url: `/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "InfoBox", id },
        { type: "InfoBox", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetInfoBoxesQuery,
  useGetInfoBoxQuery,
  useCreateInfoBoxMutation,
  useDeleteInfoBoxMutation,
} = announcementApi;

/*

import { 
  useGetInfoBoxesQuery, 
  useGetInfoBoxQuery,
  useCreateInfoBoxMutation, 
  useDeleteInfoBoxMutation 
} from '../redux/api/announcementApi';

// Seznam info boxů
const { data: infoBoxes, isLoading } = useGetInfoBoxesQuery({ 
  page: 1, 
  page_size: 10 
});

// Detail info boxu 
const { data: infoBox } = useGetInfoBoxQuery({ id: 1 });

// Vytvořit info box
const [createInfoBox] = useCreateInfoBoxMutation();

// Smazat info box  
const [deleteInfoBox] = useDeleteInfoBoxMutation();

*/