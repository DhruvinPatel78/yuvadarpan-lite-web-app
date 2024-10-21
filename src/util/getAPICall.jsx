import axios from "./useAxios";
import {
  city,
  district,
  region,
  state,
  samaj,
  surname,
  country,
} from "../store/authSlice";

export const getRegionData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/region/list/`)
    .then((res) => {
      return dispatch(region(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getCityData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/city/list/`)
    .then((res) => {
      dispatch(city(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getDistrictData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/district/list/`)
    .then((res) => {
      return dispatch(district(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getSamajData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/samaj/list/`)
    .then((res) => {
      return dispatch(samaj(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getStateData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/state/list/`)
    .then((res) => {
      return dispatch(state(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getSurnameData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/surname/list/`)
    .then((res) => {
      return dispatch(surname(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getCountryData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/country/list/`)
    .then((res) => {
      return dispatch(country(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
