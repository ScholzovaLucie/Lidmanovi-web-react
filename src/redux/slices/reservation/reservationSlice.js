import { createSlice, createSelector } from "@reduxjs/toolkit";

const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    values: {
      check_in_date: "12.24.2024",
      check_out_date: "12.26.2024",
      num_adults: 2,
      num_children: 2,
      currency: "CZK",
      primary_guest: {
        first_name: "test",
        last_name: "test",
        email: "test@test.com",
        phone: "123",
        country: "Česká republika",
        note: "test",
      },
      rooms: [],
    },
    errors: {},
  },
  reducers: {
    setErrors: (state, action) => {
      state.errors = action.payload || {};
    },

    setFieldError: (state, action) => {
      const { field, message } = action.payload;
      if (message) {
        state.errors[field] = message;
      } else {
        delete state.errors[field];
      }
    },

    updateReservation: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        if (action.payload[key] !== undefined) {
          state.values[key] = action.payload[key];
        }
      });
    },

    setTermAndGuests: (state, action) => {
      state.values.check_in_date = action.payload.checkInDate;
      state.values.check_out_date = action.payload.checkOutDate;
      state.values.num_adults = action.payload.numAdults;
      state.values.num_children = action.payload.numChildren;
      // todo: reset rooms
    },

    addRoom: (state, action) => {
      const enhancedRoom = {
        ...action.payload,
        num_adults: 0,
        num_children: 0,
      };
      state.values.rooms.push(enhancedRoom);
    },

    removeRoom: (state, action) => {
      state.values.rooms = state.values.rooms.filter(
        (room) => room.id !== action.payload,
      );
    },

    updateRoom: (state, action) => {
      const room = state.values.rooms[action.payload.index];
      if (room) {
        state.values.rooms[action.payload.index] = {
          ...room,
          ...action.payload.data,
        };
      }
    },

    updatePrimaryGuest: (state, action) => {
      const { fieldName, value } = action.payload;
      if (fieldName && value !== undefined) {
        state.values.primary_guest[fieldName] = value;
      }
    },
  },
});

export const {
  updateReservation,
  setTermAndGuests,
  addRoom,
  removeRoom,
  updateRoom,
  updatePrimaryGuest,
  setErrors,
  setFieldError,
} = reservationSlice.actions;

export const remainingCapacityToSelectSelector = createSelector(
  (state) => state.reservation,
  (reservation) => {
    const totalCapacity = reservation.values.rooms.reduce((sum, room) => {
      const capacity = Math.max(room.max_adults, room.max_children);
      return sum + capacity;
    }, 0);
    const totalGuests =
      reservation.values.num_adults + reservation.values.num_children;
    return totalGuests - totalCapacity;
  },
);

/*

// Jednoduché selectory pro jednotlivé atributy
export const selectCheckInDate = (state) => state.reservation.values.check_in_date;
export const selectCheckOutDate = (state) => state.reservation.values.check_out_date;
export const selectNumAdults = (state) => state.reservation.values.num_adults;
export const selectNumChildren = (state) => state.reservation.values.num_children;
export const selectNote = (state) => state.reservation.values.note;
export const selectCurrency = (state) => state.reservation.values.currency;
export const selectPrimaryGuest = (state) => state.reservation.values.primary_guest;
export const selectRooms = (state) => state.reservation.values.rooms;

// Memoizované selectory pomocí createSelector
export const selectReservationState = (state) => state.reservation;

export const selectGuestInfo = createSelector(
  [selectPrimaryGuest, selectNumAdults, selectNumChildren],
  (primaryGuest, numAdults, numChildren) => ({
    primaryGuest,
    numAdults,
    numChildren,
  })
);

export const selectDateRange = createSelector(
  [selectCheckInDate, selectCheckOutDate],
  (checkIn, checkOut) => ({
    checkIn,
    checkOut,
    duration: checkOut && checkIn 
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      : 0,
  })
);

export const selectBookingSummary = createSelector(
  [selectDateRange, selectGuestInfo, selectRooms, selectCurrency],
  (dateRange, guestInfo, rooms, currency) => ({
    ...dateRange,
    ...guestInfo,
    rooms,
    currency,
    totalRooms: rooms.length,
  })
);

*/

export default reservationSlice.reducer;
