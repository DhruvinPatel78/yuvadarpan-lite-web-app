import axios from "./useAxios";

export const getAccessPrice = async () => {
  const response = await axios.get("/payment/access-price");
  return response.data;
};

export const createAccessPayment = async () => {
  const response = await axios.post("/payment/create");
  return response.data;
};

export const getPaymentStatus = async (merchantOrderId) => {
  const response = await axios.get(
    `/payment/status/${encodeURIComponent(merchantOrderId)}`
  );
  return response.data;
};

export const getPaymentEnabled = async () => {
  const response = await axios.get("/payment/enabled");
  return Boolean(response.data?.enabled);
};

export const setPaymentEnabled = async (enabled) => {
  const response = await axios.patch("/payment/enabled", {
    enabled: Boolean(enabled),
  });
  return response.data;
};

export const getPurchaseReport = async (params) => {
  const response = await axios.get("/payment/report", { params });
  return response.data;
};
