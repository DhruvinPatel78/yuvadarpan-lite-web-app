import axios from "./useAxios";
import {
  city,
  district,
  region,
  state,
  samaj,
  surname,
  country,
  role,
} from "../store/locationSlice";

export const getAllRegionData = (dispatch) => {
  axios
    .get(`/region/get-all-list`)
    .then((res) => {
      return dispatch(region(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllCityData = (dispatch) => {
  axios
    .get(`/city/get-all-list`)
    .then((res) => {
      dispatch(city(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllDistrictData = (dispatch) => {
  axios
    .get(`/district/get-all-list`)
    .then((res) => {
      return dispatch(district(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllSamajData = (dispatch) => {
  axios
    .get(`/samaj/get-all-list`)
    .then((res) => {
      return dispatch(samaj(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllStateData = (dispatch) => {
  axios
    .get(`/state/get-all-list`)
    .then((res) => {
      return dispatch(state(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllSurnameData = (dispatch) => {
  axios
    .get(`/surname/get-all-list`)
    .then((res) => {
      return dispatch(surname(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllCountryData = (dispatch) => {
  axios
    .get(`/country/get-all-list`)
    .then((res) => {
      return dispatch(country(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const getAllRoleData = (dispatch) => {
  axios
    .get(`/role/get-all-list`)
    .then((res) => {
      return dispatch(role(res.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
// export const getDataByPagination = ({ field, page, limit }) => {
//   axios
//     .get(
//       `${process.env.REACT_APP_BASE_URL}/${field}/list?page=${page}&limit=${limit}`
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };
