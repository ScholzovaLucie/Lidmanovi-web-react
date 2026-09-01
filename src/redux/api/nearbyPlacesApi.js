import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, baseQueryWithAuth } from "../constants";

export const nearbyPlacesApi = createApi({
  reducerPath: "nearbyPlacesApi",
  baseQuery,
  tagTypes: ["NearbyPlace"],
  endpoints: (builder) => ({
    nearbyPlaces: builder.query({
      query: () => "/pension/public/nearby-places/",
      providesTags: ["NearbyPlace"],
    }),
  }),
});

export const adminNearbyPlacesApi = createApi({
  reducerPath: "adminNearbyPlacesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["NearbyPlace"],
  endpoints: (builder) => ({
    adminNearbyPlaces: builder.query({
      query: () => "/pension/admin/nearby-places/",
      providesTags: ["NearbyPlace"],
    }),
    createNearbyPlace: builder.mutation({
      query: (data) => ({
        url: "/pension/admin/nearby-places/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NearbyPlace"],
    }),
    updateNearbyPlace: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pension/admin/nearby-places/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["NearbyPlace"],
    }),
    deleteNearbyPlace: builder.mutation({
      query: (id) => ({
        url: `/pension/admin/nearby-places/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["NearbyPlace"],
    }),
  }),
});

export const { useNearbyPlacesQuery } = nearbyPlacesApi;

export const {
  useAdminNearbyPlacesQuery,
  useCreateNearbyPlaceMutation,
  useUpdateNearbyPlaceMutation,
  useDeleteNearbyPlaceMutation,
} = adminNearbyPlacesApi;
