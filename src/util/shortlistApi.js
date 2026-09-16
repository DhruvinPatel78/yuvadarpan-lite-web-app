import axios from "./useAxios";

export const getShortlistIds = async () => {
  const response = await axios.get("/shortlist/ids");
  return response.data?.data || [];
};

export const getShortlistedYuvas = async (params) => {
  const response = await axios.get("/shortlist", { params });
  return response.data;
};

export const addYuvaToShortlist = async (yuvaId) => {
  const response = await axios.post("/shortlist", { yuvaId });
  return response.data;
};

export const removeYuvaFromShortlist = async (yuvaId) => {
  const response = await axios.delete(`/shortlist/${yuvaId}`);
  return response.data;
};
