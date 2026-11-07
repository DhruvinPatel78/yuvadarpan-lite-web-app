import axios from "./useAxios";

export const getCityList = async () => {
  try {
    const response = await axios.get("/yuvaList/citylist");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getYuvaList = async (params) => {
  try {
    const response = await axios.get("/yuvaList/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 