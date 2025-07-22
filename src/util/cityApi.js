import axios from "./useAxios";

export const getCityList = async (params) => {
  try {
    const response = await axios.get("/city/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCity = async (payload) => {
  try {
    const response = await axios.post("/city/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCity = async (id, payload) => {
  try {
    const response = await axios.patch(`/city/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCity = async (ids) => {
  try {
    const response = await axios.delete("/city/delete", { data: { cities: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 