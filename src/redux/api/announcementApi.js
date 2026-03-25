import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../constants";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["InfoBox"],
  endpoints: (builder) => ({
    // GET /editorial_system/info-boxes/ - seznam info boxů s paginací
    getInfoBoxes: builder.query({
      query: ({ page = 1, page_size = 10, lang } = {}) => ({
        url: "/editorial_system/info-boxes/",
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
        url: `/editorial_system/info-boxes/${id}/`,
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
        url: "/editorial_system/info-boxes/",
        method: "POST",
        body: newInfoBox,
      }),
      invalidatesTags: [{ type: "InfoBox", id: "LIST" }],
    }),

    // DELETE /editorial_system/info-boxes/{id}/ - smazání info boxu
    deleteInfoBox: builder.mutation({
      query: (id) => ({
        url: `/editorial_system/info-boxes/${id}/`,
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