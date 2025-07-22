import axios from "./useAxios";

export const getDistrictList = async (params) => {
  try {
    const response = await axios.get("/district/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addDistrict = async (payload) => {
  try {
    const response = await axios.post("/district/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDistrict = async (id, payload) => {
  try {
    const response = await axios.patch(`/district/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDistrict = async (ids) => {
  try {
    const response = await axios.delete("/district/delete", { data: { districts: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 