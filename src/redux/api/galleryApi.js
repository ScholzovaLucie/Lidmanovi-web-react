import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

export const galleryApi = createApi({
  reducerPath: "galleryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Photo", "PhotoPlacement"],
  endpoints: (builder) => ({
    // GET /editorial_system/photos/ - plochá knihovna všech nahraných fotek
    getPhotos: builder.query({
      query: ({ page = 1, pageSize = 24 } = {}) => ({
        url: "/editorial_system/photos/",
        params: { page, page_size: pageSize },
      }),
      transformResponse: (response) =>
        Array.isArray(response)
          ? { results: response, count: response.length }
          : { results: response?.results || [], count: response?.count || 0 },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: "Photo", id })),
              { type: "Photo", id: "LIST" },
            ]
          : [{ type: "Photo", id: "LIST" }],
    }),

    // GET /editorial_system/photo-placements/?location=... - fotky pro danou sekci, seřazené podle order
    getPhotoPlacements: builder.query({
      query: ({ location, page = 1, pageSize = 24 }) => ({
        url: "/editorial_system/photo-placements/",
        params: { location, page, page_size: pageSize },
      }),
      // Backend odpověď je někdy stránkovaná ({ count, results: [...] }), jindy holé pole.
      transformResponse: (response) =>
        Array.isArray(response)
          ? { results: response, count: response.length }
          : { results: response?.results || [], count: response?.count || 0 },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: "PhotoPlacement", id })),
              { type: "PhotoPlacement", id: "LIST" },
            ]
          : [{ type: "PhotoPlacement", id: "LIST" }],
    }),

    // POST /editorial_system/photos/ - nahrání jedné nebo více fotek (multipart/form-data)
    uploadPhotos: builder.mutation({
      query: ({ category, files }) => {
        const formData = new FormData();
        formData.append("category", category);
        files.forEach((file) => formData.append("images", file));
        return {
          url: "/editorial_system/photos/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Photo"],
    }),

    // DELETE /editorial_system/photos/{id}/ - úplné smazání fotky (smaže i všechna umístění)
    deletePhoto: builder.mutation({
      query: (id) => ({
        url: `/editorial_system/photos/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Photo", { type: "PhotoPlacement", id: "LIST" }],
    }),

    // POST /editorial_system/photo-placements/ - přiřazení fotky do sekce
    createPhotoPlacement: builder.mutation({
      query: ({ photo, location, order }) => ({
        url: "/editorial_system/photo-placements/",
        method: "POST",
        body: { photo, location, order },
      }),
      invalidatesTags: [{ type: "PhotoPlacement", id: "LIST" }],
    }),

    // DELETE /editorial_system/photo-placements/{id}/ - odebrání fotky ze sekce (fotku samotnou nemaže)
    deletePhotoPlacement: builder.mutation({
      query: (id) => ({
        url: `/editorial_system/photo-placements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PhotoPlacement", id: "LIST" }],
    }),

    // PATCH /editorial_system/photo-placements/{id}/ - změna pořadí fotky v sekci
    updatePhotoPlacementOrder: builder.mutation({
      query: ({ id, order }) => ({
        url: `/editorial_system/photo-placements/${id}/`,
        method: "PATCH",
        body: { order },
      }),
      invalidatesTags: [{ type: "PhotoPlacement", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPhotosQuery,
  useLazyGetPhotosQuery,
  useGetPhotoPlacementsQuery,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
  useCreatePhotoPlacementMutation,
  useDeletePhotoPlacementMutation,
  useUpdatePhotoPlacementOrderMutation,
} = galleryApi;
