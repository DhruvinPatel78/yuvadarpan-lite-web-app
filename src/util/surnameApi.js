import axios from "./useAxios";

export const getSurnameList = async (params) => {
  try {
    const response = await axios.get("/surname/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSurname = async (payload) => {
  try {
    const response = await axios.post("/surname/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSurname = async (id, payload) => {
  try {
    const response = await axios.patch(`/surname/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSurname = async (ids) => {
  try {
    const response = await axios.delete("/surname/delete", { data: { surnames: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 