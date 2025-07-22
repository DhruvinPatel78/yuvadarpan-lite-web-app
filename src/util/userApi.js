import axios from "./useAxios";

export const getUserList = async (params) => {
  try {
    const response = await axios.get("/user/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (payload) => {
  try {
    const response = await axios.post("/user/add/", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, payload) => {
  try {
    const response = await axios.patch(`/user/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (ids) => {
  try {
    const response = await axios.delete("/user/delete", { data: { users: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSamajListByRegion = async (regionId) => {
  try {
    const response = await axios.get(`/samaj/listByRegion/${regionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 