import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    auth: {
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    },
  },
  reducers: {
    setTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.auth.accessToken = access;
      state.auth.refreshToken = refresh;
      state.auth.isAuthenticated = !!access;
    },
    clearAuth: (state) => {
      state.auth.accessToken = null;
      state.auth.refreshToken = null;
      state.auth.isAuthenticated = false;
    },
    // Legacy support
    setToken: (state, action) => {
      state.auth.accessToken = action.payload;
      state.auth.isAuthenticated = !!action.payload;
    },
  },
});

export const { setTokens, clearAuth, setToken } = appSlice.actions;
export const selectAuth = (state) => state.app.auth;
export const selectIsAuthenticated = (state) => state.app.auth.isAuthenticated;
export default appSlice.reducer;
