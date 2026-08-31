import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

export const vouchersApi = createApi({
  reducerPath: "vouchersApi",
  tagTypes: ["Vouchers", "VoucherAmounts"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    voucherAmounts: builder.query({
      query: () => "/pension/public/vouchers/amounts/",
      providesTags: ["VoucherAmounts"],
    }),
    createVoucherOrder: builder.mutation({
      query: (payload) => ({
        url: "/pension/public/vouchers/create/",
        method: "POST",
        body: payload,
      }),
    }),
    vouchers: builder.query({
      query: (filters = {}) => ({
        url: "/pension/admin/vouchers/",
        method: "GET",
        params: {
          page: filters.page,
          page_size: filters.page_size,
          status: filters.status,
          delivery_method: filters.delivery_method,
          search_text: filters.search_text,
        },
      }),
      providesTags: ["Vouchers"],
    }),
    voucherStatuses: builder.query({
      query: () => "/pension/public/vouchers/statuses/",
    }),
    updateVoucherStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/pension/admin/vouchers/${id}/update/`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Vouchers"],
    }),
    adminVoucherAmounts: builder.query({
      query: () => "/pension/admin/voucher-amounts/",
      providesTags: ["VoucherAmounts"],
    }),
    createVoucherAmount: builder.mutation({
      query: (data) => ({
        url: "/pension/admin/voucher-amounts/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VoucherAmounts"],
    }),
    updateVoucherAmount: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pension/admin/voucher-amounts/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VoucherAmounts"],
    }),
    deleteVoucherAmount: builder.mutation({
      query: (id) => ({
        url: `/pension/admin/voucher-amounts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["VoucherAmounts"],
    }),
  }),
});

export const {
  useVoucherAmountsQuery,
  useCreateVoucherOrderMutation,
  useVouchersQuery,
  useLazyVoucherStatusesQuery,
  useUpdateVoucherStatusMutation,
  useAdminVoucherAmountsQuery,
  useCreateVoucherAmountMutation,
  useUpdateVoucherAmountMutation,
  useDeleteVoucherAmountMutation,
} = vouchersApi;
