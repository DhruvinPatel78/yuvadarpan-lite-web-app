import axios from "./useAxios";

export const getSamajList = async (params) => {
  try {
    const response = await axios.get("/samaj/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSamaj = async (payload) => {
  try {
    const response = await axios.post("/samaj/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSamaj = async (id, payload) => {
  try {
    const response = await axios.patch(`/samaj/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSamaj = async (ids) => {
  try {
    const response = await axios.delete("/samaj/delete", { data: { samaj: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 