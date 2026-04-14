import axios from "./useAxios";

export const getNativeList = async (params) => {
  try {
    const response = await axios.get("/native/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNative = async (payload) => {
  try {
    const response = await axios.post("/native/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNative = async (id, payload) => {
  try {
    const response = await axios.patch(`/native/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNative = async (ids) => {
  try {
    const response = await axios.delete("/native/delete", { data: { natives: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 