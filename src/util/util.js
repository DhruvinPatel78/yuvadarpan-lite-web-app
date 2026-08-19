import moment from "moment";

export const toCamelCase = (str = "") => {
  let result = str;
  if (result.length) {
    result = result[0].toUpperCase() + result.slice(1, result.length);
  }

  return result;
};

export const normalizeRole = (role) => {
  const raw =
    typeof role === "object" && role
      ? role.name || role.value || role.role || ""
      : role;
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

export const isRegularUser = (role) => normalizeRole(role) === "USER";

export const isSamajManager = (role) =>
  normalizeRole(role) === "SAMAJ_MANAGER";

export const isCityManager = (role) => normalizeRole(role) === "CITY_MANAGER";

export const isDistrictManager = (role) =>
  normalizeRole(role) === "DISTRICT_MANAGER";

export const isRegionManager = (role) =>
  normalizeRole(role) === "REGION_MANAGER";

export const isStateManager = (role) =>
  normalizeRole(role) === "STATE_MANAGER";

export const isCountryManager = (role) =>
  normalizeRole(role) === "COUNTRY_MANAGER";

export const formatYuvaDob = (value) => {
  if (value == null || value === "") return "";
  const raw =
    typeof value === "object" && value.$date ? value.$date : value;
  const parsed = moment(raw);
  if (parsed.isValid()) {
    const hasTime =
      parsed.hours() !== 0 || parsed.minutes() !== 0 || parsed.seconds() !== 0;
    return parsed.format(hasTime ? "DD/MM/YYYY, hh:mm A" : "DD/MM/YYYY");
  }
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 8) {
    const compact = moment(digits, "DDMMYYYY", true);
    if (compact.isValid()) return compact.format("DD/MM/YYYY");
  }
  return "";
};

export const isLocationMasterReadOnly = (role) =>
  isSamajManager(role) ||
  isCityManager(role) ||
  isDistrictManager(role) ||
  isRegionManager(role) ||
  isStateManager(role) ||
  isCountryManager(role);

export const hideLocationRowActions = (role) =>
  isCityManager(role) ||
  isDistrictManager(role) ||
  isRegionManager(role) ||
  isStateManager(role) ||
  isCountryManager(role);
