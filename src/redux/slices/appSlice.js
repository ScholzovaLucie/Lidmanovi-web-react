import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    auth: {
      token: null,
    },
  },
  reducers: {
    setToken: (state, action) => {
      state.auth.token = action.payload;
    },
  },
});

export const { setToken } = appSlice.actions;

export default appSlice.reducer;
