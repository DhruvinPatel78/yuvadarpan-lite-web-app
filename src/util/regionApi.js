import axios from "./useAxios";

export const getRegionList = async (params) => {
  try {
    const response = await axios.get("/region/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addRegion = async (payload) => {
  try {
    const response = await axios.post("/region/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRegion = async (id, payload) => {
  try {
    const response = await axios.patch(`/region/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRegion = async (ids) => {
  try {
    const response = await axios.delete("/region/delete", { data: { regions: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 