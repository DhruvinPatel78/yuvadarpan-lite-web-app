import axios from "./useAxios";

export const getCountryList = async (params) => {
  try {
    const response = await axios.get("/country/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCountry = async (payload) => {
  try {
    const response = await axios.post("/country/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCountry = async (id, payload) => {
  try {
    const response = await axios.patch(`/country/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCountry = async (ids) => {
  try {
    const response = await axios.delete("/country/delete", { data: { countries: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 