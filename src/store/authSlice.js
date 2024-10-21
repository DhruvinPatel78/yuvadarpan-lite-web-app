import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loggedIn: false,
  loading: false,
  error: null,
  region: [],
  state: [],
  distric: [],
  city: [],
  samaj: [],
  surname: [],
  country: [],
};

const authSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.loading = true;
    },
    endLoading: (state, action) => {
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
      state.region = [];
      state.state = [];
      state.distric = [];
      state.city = [];
      state.samaj = [];
      state.surname = [];
    },
    region: (state, action) => {
      state.region = action.payload;
    },
    state: (state, action) => {
      state.state = action.payload;
    },
    district: (state, action) => {
      state.distric = action.payload;
    },
    city: (state, action) => {
      state.city = action.payload;
    },
    surname: (state, action) => {
      state.surname = action.payload;
    },
    samaj: (state, action) => {
      state.samaj = action.payload;
    },
    country: (state, action) => {
      state.country = action.payload;
    },
  },
});

export const {
  login,
  logout,
  startLoading,
  endLoading,
  region,
  state,
  district,
  surname,
  samaj,
  country,
  city,
} = authSlice.actions;

export default authSlice.reducer;
