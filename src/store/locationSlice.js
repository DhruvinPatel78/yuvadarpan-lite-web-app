import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  region: [],
  state: [],
  district: [],
  city: [],
  samaj: [],
  surname: [],
  country: [],
  role: [],
};

const locationReducer = createSlice({
  name: "LocationSlice",
  initialState,
  reducers: {
    region: (state, action) => {
      state.region = action.payload;
    },
    state: (state, action) => {
      state.state = action.payload;
    },
    district: (state, action) => {
      state.district = action.payload;
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
    role: (state, action) => {
      state.role = action.payload;
    },
    clearLocation: (state, action) => {
      state.region = [];
      state.state = [];
      state.district = [];
      state.city = [];
      state.samaj = [];
      state.surname = [];
      state.role = [];
    },
  },
});

export const {
  state,
  district,
  surname,
  samaj,
  country,
  city,
  region,
  clearLocation,
  role,
} = locationReducer.actions;

export default locationReducer.reducer;
