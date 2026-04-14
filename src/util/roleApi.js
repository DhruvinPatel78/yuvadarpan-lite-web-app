import axios from "./useAxios";

export const getRoleList = async (params) => {
  try {
    const response = await axios.get("/role/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRole = async (id, payload) => {
  try {
    const response = await axios.patch(`/role/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRole = async (ids) => {
  try {
    const response = await axios.delete("/role/delete", { data: { role: ids } });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 