import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens, clearAuth } from "../slices/app/appSlice";
import { storeTokens, clearTokens, getStoredTokens } from "../../utils/cookieUtils";
import { withLanguageHeader } from "./language";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/pension",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().app.auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return withLanguageHeader(headers);
  },
});

const authBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  prepareHeaders: (headers) => withLanguageHeader(headers),
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const tokens = getStoredTokens();

    if (tokens.refresh) {
      const refreshResult = await authBaseQuery(
        {
          url: "/token/refresh/",
          method: "POST",
          body: { refresh: tokens.refresh },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data?.access) {
        const newTokens = {
          access: refreshResult.data.access,
          refresh: tokens.refresh,
        };
        storeTokens(newTokens.access, newTokens.refresh);
        api.dispatch(setTokens(newTokens));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearAuth());
        clearTokens();
      }
    } else {
      api.dispatch(clearAuth());
      clearTokens();
    }
  }

  return result;
};

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
        url: "/public/reservations/create/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Reservations"],
    }),

    reservations: builder.query({
      query: (filters = {}) => {
        const params = {};

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
          url: "/admin/reservations/",
          method: "GET",
          params,
        };
      },
      providesTags: ["Reservations"],
    }),

    reservationStatuses: builder.query({
      query: () => "/admin/reservations/statuses/",
      method: "GET",
      providesTags: ["ReservationStatuses"],
    }),

    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/reservations/${id}/update/`,
        method: "PUT",
        body: { status },
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
} = reservationsApi;
