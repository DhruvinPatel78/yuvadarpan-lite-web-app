import axios from "./useAxios";

export const getStateList = async (params) => {
  try {
    const response = await axios.get("/state/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addState = async (payload) => {
  try {
    const response = await axios.post("/state/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateState = async (id, payload) => {
  try {
    const response = await axios.patch(`/state/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteState = async (ids) => {
  try {
    const response = await axios.delete("/state/delete", { data: { states: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 