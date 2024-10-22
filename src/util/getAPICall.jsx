import axios from "./useAxios";
import {
  city,
  district,
  region,
  state,
  samaj,
  surname,
  country,
} from "../store/locationSlice";

export const getAllRegionData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/region/get-all-list`)
    .then((res) => {
      return dispatch(region(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllCityData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/city/get-all-list`)
    .then((res) => {
      dispatch(city(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllDistrictData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/district/get-all-list`)
    .then((res) => {
      return dispatch(district(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllSamajData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/samaj/get-all-list`)
    .then((res) => {
      return dispatch(samaj(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllStateData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/state/get-all-list`)
    .then((res) => {
      return dispatch(state(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllSurnameData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/surname/get-all-list`)
    .then((res) => {
      return dispatch(surname(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllCountryData = (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_BASE_URL}/country/get-all-list`)
    .then((res) => {
      return dispatch(country(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
// export const getCountryData = ({ page, limit }) => {
//   axios
//     .get(
//       `${process.env.REACT_APP_BASE_URL}/country/list?page=${page}&limit=${limit}`
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };
