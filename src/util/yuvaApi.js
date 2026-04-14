import axios from "./useAxios";

export const getYuvaPDF = async () => {
  try {
    const response = await axios.get("/yuvaList/yuvaPDF");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCityList = async () => {
  try {
    const response = await axios.get("/yuvaList/citylist");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getYuvaList = async () => {
  try {
    const response = await axios.get("/yuvaList/get-all-list");
    return response.data;
  } catch (error) {
    throw error;
  }
}; 