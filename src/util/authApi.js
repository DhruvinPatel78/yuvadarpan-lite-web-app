import useAxios from "./useAxios";

export const loginUser = async (credentials) => {
  try {
    const response = await useAxios.post("/user/signIn", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (payload) => {
  try {
    const response = await useAxios.post("/user/signup", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (email, password) => {
  try {
    const response = await useAxios.patch("/user/forgotPassword", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await useAxios.post("/user/sendOtp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await useAxios.post("/user/verifyOtp", { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await useAxios.post("/user/sendOtp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
