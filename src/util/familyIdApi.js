import axios from "./useAxios";

export const getFamilyIdList = async (params) => {
  try {
    const response = await axios.get("/familyId/list", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFamilyId = async (payload) => {
  try {
    const response = await axios.post("/familyId/add", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateFamilyId = async (id, payload) => {
  try {
    const response = await axios.patch(`/familyId/update/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFamilyId = async (ids) => {
  try {
    const response = await axios.delete("/familyId/delete", {
      data: { familyIds: Array.isArray(ids) ? ids : [ids] },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUserFamilyId = async () => {
  try {
    const response = await axios.get("/familyId/check-user");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/** Resolve whether the signed-in USER's familyId exists in the master list. */
export const resolveUserFamilyIdExists = async (user) => {
  try {
    const check = await checkUserFamilyId();
    if (typeof check?.exists === "boolean") {
      return check.exists;
    }
  } catch {
    // Fall through to master-list lookup if check-user is unavailable.
  }
  const familyId = String(user?.familyId ?? "").trim();
  if (!familyId) {
    return false;
  }
  try {
    const response = await axios.get("/familyId/get-all-list", {
      params: { t: Date.now() },
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    const rows = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    return rows.some((row) => {
      if (row?.active === false) {
        return false;
      }
      return String(row?.familyId ?? "").trim().toLowerCase() === familyId.toLowerCase();
    });
  } catch {
    return false;
  }
};
