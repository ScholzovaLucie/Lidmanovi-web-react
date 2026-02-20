import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/pension",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
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
        url: "/public/reservations/create/",
        method: "POST",
        body: payload,
      }),
    }),

    reservations: builder.query({
      query: () => "/admin/reservations/",
      method: "GET",
    }),
  }),
});

export const { useCreateReservationMutation, useReservationsQuery } =
  reservationsApi;
