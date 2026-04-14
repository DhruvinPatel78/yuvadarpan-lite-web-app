import axios from "./useAxios";

export const getUserRequests = async (params) => {
  try {
    const response = await axios.get("/user/requests", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveRejectUser = async (id, allowed) => {
  try {
    const response = await axios.patch(`/user/update/${id}`, { allowed });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveRejectMany = async (ids, action) => {
  try {
    const response = await axios.patch("/user/approveRejectMany", { ids, action });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 