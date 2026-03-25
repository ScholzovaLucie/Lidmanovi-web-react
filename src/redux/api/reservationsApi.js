import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../constants";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  tagTypes: ["Reservations", "ReservationStatuses"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    /**
     * Create a new reservation
     * @param {Object} payload - The reservation data
     * @param {string} payload.check_in_date - Check-in date (YYYY-MM-DD)
     * @param {string} payload.check_out_date - Check-out date (YYYY-MM-DD)
     * @param {number} payload.num_adults - Number of adults
     * @param {number} payload.num_children - Number of children
     * @param {string} payload.note - Reservation note
     * @param {string} payload.currency - Currency code
     * @param {Object} payload.primary_guest - Primary guest information
     * @param {string} payload.primary_guest.first_name - Guest's first name
     * @param {string} payload.primary_guest.last_name - Guest's last name
     * @param {string} payload.primary_guest.email - Guest's email address
     * @param {string} payload.primary_guest.phone - Guest's phone number
     * @param {string} payload.primary_guest.country - Guest's country
     * @param {string} payload.primary_guest.note - Note about the guest
     * @param {Array<Object>} payload.rooms - Array of room reservations
     * @param {number} payload.rooms[].id - Room ID
     * @param {number} payload.rooms[].num_adults - Number of adults in this room
     * @param {number} payload.rooms[].num_children - Number of children in this room
     */
    createReservation: builder.mutation({
      query: (payload) => ({
        url: "/pension/public/reservations/create/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Reservations"],
    }),

    reservations: builder.query({
      query: (filters = {}) => {
        const params = {};

        // Pagination parametry
        if (filters.page) {
          params.page = filters.page;
        }
        if (filters.page_size) {
          params.page_size = filters.page_size;
        }

        // Existující filtry
        if (filters.reservation_from) {
          params.reservation_from = filters.reservation_from;
        }
        if (filters.reservation_to) {
          params.reservation_to = filters.reservation_to;
        }
        if (filters.room_id) {
          params.room_id = filters.room_id;
        }
        if (filters.status) {
          params.status = filters.status;
        }
        if (filters.search_text) {
          params.search_text = filters.search_text;
        }
        if (filters.primary_guest_email) {
          params.primary_guest_email = filters.primary_guest_email;
        }
        if (filters.primary_guest_last_name) {
          params.primary_guest_last_name = filters.primary_guest_last_name;
        }
        if (filters.primary_guest_id) {
          params.primary_guest_id = filters.primary_guest_id;
        }

        return {
          url: "/pension/admin/reservations/",
          method: "GET",
          params,
        };
      },
      providesTags: ["Reservations"],
    }),

    reservationStatuses: builder.query({
      query: () => "/pension/public/reservations/statuses/",
      method: "GET",
      providesTags: ["ReservationStatuses"],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/pension/admin/reservations/${id}/update/`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Reservations"],
    }),

    updateReservationNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/pension/admin/reservations/${id}/update/`,
        method: "PUT",
        body: { note },
      }),
      invalidatesTags: ["Reservations"],
    }),
  }),
});

export const {
  useCreateReservationMutation,
  useReservationsQuery,
  useLazyReservationsQuery,
  useReservationStatusesQuery,
  useUpdateReservationStatusMutation,
  useUpdateReservationNoteMutation,
} = reservationsApi;
