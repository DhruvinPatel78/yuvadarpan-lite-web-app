import axios from "./useAxios";

export const getActivityLogs = async (params) => {
  const response = await axios.get("/logs/list", { params });
  return response.data;
};

export const getActivityLog = async (id) => {
  const response = await axios.get(`/logs/${id}`);
  return response.data;
};

export const clearActivityLogs = async () => {
  const response = await axios.delete("/logs/clear");
  return response.data;
};
