import axios from "./useAxios";

export const getYuvaList = async (params) => {
  try {
    const response = await axios.get("/yuvaList/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteYuva = async (id) => {
  try {
    const response = await axios.delete(`/yuvaList/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNativeList = async () => {
  try {
    const response = await axios.get("/native/get-all-list");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addYuva = async (payload) => {
  try {
    const response = await axios.post("/yuvaList/addYuvaList", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateYuva = async (id, payload) => {
  try {
    const response = await axios.patch(`/yuvaList/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 