import axios from "./useAxios";

export const AD_DISPLAY_PAGES = [
  { id: "login", value: "login", label: "Login", name: "Login" },
  { id: "signup", value: "signup", label: "Signup", name: "Signup" },
  { id: "dashboard", value: "dashboard", label: "Home page", name: "Home page" },
  { id: "profile", value: "profile", label: "Profile", name: "Profile" },
  {
    id: "share_profile",
    value: "share_profile",
    label: "Share Profile",
    name: "Share Profile",
  },
];

export const formatDisplayOn = (values = []) => {
  const map = Object.fromEntries(
    AD_DISPLAY_PAGES.map((item) => [item.value, item.label])
  );
  return (Array.isArray(values) ? values : [])
    .map((value) => map[value] || value)
    .filter(Boolean)
    .join(", ");
};

export const getAdvertisementList = async (params) => {
  const response = await axios.get("/advertisement/list", { params });
  return response.data;
};

export const addAdvertisement = async (payload) => {
  const response = await axios.post("/advertisement/add", payload);
  return response.data;
};

export const updateAdvertisement = async (id, payload) => {
  const response = await axios.patch(`/advertisement/update/${id}`, payload);
  return response.data;
};

export const deleteAdvertisement = async (ids) => {
  const response = await axios.delete("/advertisement/delete", {
    data: { advertisementIds: Array.isArray(ids) ? ids : [ids] },
  });
  return response.data;
};

export const reorderAdvertisement = async (payload) => {
  const response = await axios.patch("/advertisement/reorder", payload);
  return response.data;
};

export const getAdvertisementsByPage = async (page) => {
  const response = await axios.get(`/advertisement/by-page/${page}`);
  return response.data?.data || [];
};

export const getAdvertisementDisplayEnabled = async () => {
  const response = await axios.get("/advertisement/display-enabled");
  return Boolean(response.data?.enabled);
};

export const setAdvertisementDisplayEnabled = async (enabled) => {
  const response = await axios.patch("/advertisement/display-enabled", {
    enabled: Boolean(enabled),
  });
  return response.data;
};

export const uploadAdvertisementImage = async (file, filename) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "ad_images");
  if (filename) {
    formData.append("filename", filename);
  }
  const response = await axios.post("/image/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data;
};
