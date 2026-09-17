import axios from "./useAxios";

const LINKED_PATHS = {
  country: "/country/linked",
  state: "/state/linked",
  region: "/region/linked",
  district: "/district/linked",
  city: "/city/linked",
  samaj: "/samaj/linked",
  surname: "/surname/linked",
  native: "/native/linked",
  role: "/role/linked",
  user: "/user/linked",
  yuva: "/yuvaList/linked",
};

export const getLinkedRecords = async (entity, ids = []) => {
  const path = LINKED_PATHS[entity];
  if (!path) {
    return { mapped: false, groups: [] };
  }
  const response = await axios.post(path, {
    ids: Array.isArray(ids) ? ids : [ids],
  });
  return response.data;
};
