import axios from "./useAxios";

export const getGotraList = async (params) => {
  try {
    const response = await axios.get("/gotra/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGotraAllList = async () => {
  try {
    const response = await axios.get("/gotra/get-all-list");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addGotra = async (payload) => {
  try {
    const response = await axios.post("/gotra/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGotra = async (id, payload) => {
  try {
    const response = await axios.patch(`/gotra/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGotra = async (ids) => {
  try {
    const response = await axios.delete("/gotra/delete", {
      data: { gotras: ids },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
