import axios from "./useAxios";

export const getVibhagList = async (params) => {
  try {
    const response = await axios.get("/vibhag/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addVibhag = async (payload) => {
  try {
    const response = await axios.post("/vibhag/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVibhag = async (id, payload) => {
  try {
    const response = await axios.patch(`/vibhag/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVibhag = async (ids) => {
  try {
    const response = await axios.delete("/vibhag/delete", {
      data: { vibhags: ids },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVibhagsByRegion = async (id) => {
  try {
    const response = await axios.get(`/vibhag/list/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVibhagInfo = async (id) => {
  try {
    const response = await axios.get(`/vibhag/getInfo/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
