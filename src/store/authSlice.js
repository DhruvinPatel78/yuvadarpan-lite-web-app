import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loading = true;
      state.user = null;
      state.loggedIn = false;
      state.error = null;
    },
    stopLoading: (state, action) => {
      state.loading = false;
    },
    login: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.loggedIn = true;
      state.error = null;
    },
    logout: (state, action) => {
      state.user = null;
      state.loggedIn = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { login, logout, startLoading } = authSlice.actions;

export default authSlice.reducer;
