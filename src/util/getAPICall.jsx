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

const MASTER_MAP = {
  region: { path: "region", action: region },
  city: { path: "city", action: city },
  district: { path: "district", action: district },
  samaj: { path: "samaj", action: samaj },
  state: { path: "state", action: state },
  surname: { path: "surname", action: surname },
  country: { path: "country", action: country },
  role: { path: "role", action: role },
  gotra: { path: "gotra", action: gotra },
  native: { path: "native", action: native },
};

const asRows = (value) =>
  Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];

export const resetMasterFetches = () => {
  Object.keys(inflight).forEach((key) => {
    delete inflight[key];
  });
};

const runFetch =
  (key, { force = false } = {}) =>
  (dispatch, getState) => {
    const meta = MASTER_MAP[key];
    if (!meta) {
      return Promise.resolve([]);
    }
    if (!force) {
      const existing = asRows(getState()?.location?.[key]);
      if (existing.length) {
        return Promise.resolve(existing);
      }
    }
    const inflightKey = force ? `${key}:force` : key;
    if (inflight[inflightKey]) {
      return inflight[inflightKey];
    }
    inflight[inflightKey] = axios
      .get(`/${meta.path}/get-all-list`, {
        params: force ? { t: Date.now() } : undefined,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      })
      .then((res) => {
        const list = asRows(res.data);
        dispatch(meta.action(list));
        return list;
      })
      .catch((error) => {
        console.log(error);
        return [];
      })
      .finally(() => {
        delete inflight[inflightKey];
      });
    return inflight[inflightKey];
  };

const fetchAll = (key) => runFetch(key);

export const getAllRegionData = fetchAll("region");
export const getAllCityData = fetchAll("city");
export const getAllDistrictData = fetchAll("district");
export const getAllSamajData = fetchAll("samaj");
export const getAllStateData = fetchAll("state");
export const getAllSurnameData = fetchAll("surname");
export const getAllCountryData = fetchAll("country");
export const getAllRoleData = fetchAll("role");
export const getAllGotraData = fetchAll("gotra");
export const getAllNativeData = fetchAll("native");

export const refreshMaster = (key) => runFetch(key, { force: true });

export const refreshMastersSilently = (dispatch, keys = []) =>
  Promise.all(
    (Array.isArray(keys) ? keys : [keys])
      .filter((key) => MASTER_MAP[key])
      .map((key) => dispatch(refreshMaster(key)))
  );

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
