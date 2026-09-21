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
  gotra,
  native,
} from "../store/locationSlice";

const inflight = {};

const asRows = (value) =>
  Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];

export const resetMasterFetches = () => {
  Object.keys(inflight).forEach((key) => {
    delete inflight[key];
  });
};

const fetchAll = (key, path, action) => (dispatch, getState) => {
  const existing = asRows(getState()?.location?.[key]);
  if (existing.length) {
    return Promise.resolve(existing);
  }
  if (inflight[key]) {
    return inflight[key];
  }
  inflight[key] = axios
    .get(`/${path}/get-all-list`)
    .then((res) => {
      const list = asRows(res.data);
      dispatch(action(list));
      return list;
    })
    .catch((error) => {
      console.log(error);
      return [];
    })
    .finally(() => {
      delete inflight[key];
    });
  return inflight[key];
};

export const getAllRegionData = fetchAll("region", "region", region);
export const getAllCityData = fetchAll("city", "city", city);
export const getAllDistrictData = fetchAll("district", "district", district);
export const getAllSamajData = fetchAll("samaj", "samaj", samaj);
export const getAllStateData = fetchAll("state", "state", state);
export const getAllSurnameData = fetchAll("surname", "surname", surname);
export const getAllCountryData = fetchAll("country", "country", country);
export const getAllRoleData = fetchAll("role", "role", role);
export const getAllGotraData = fetchAll("gotra", "gotra", gotra);
export const getAllNativeData = fetchAll("native", "native", native);

export const loadLocationMasters = (dispatch) => {
  dispatch(getAllCountryData);
  dispatch(getAllStateData);
  dispatch(getAllRegionData);
  dispatch(getAllDistrictData);
  dispatch(getAllCityData);
  dispatch(getAllSamajData);
  dispatch(getAllSurnameData);
  dispatch(getAllGotraData);
  dispatch(getAllNativeData);
  dispatch(getAllRoleData);
};
