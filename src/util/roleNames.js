export const ROLE_NAMES = {
  ADMIN: "Admin",
  USER: "User",
  SAMAJ_MANAGER: "Samaj Manager",
  CITY_MANAGER: "City Manager",
  DISTRICT_MANAGER: "District Manager",
  VIBHAG_MANAGER: "Vibhag Manager",
  REGION_MANAGER: "Region Manager",
  STATE_MANAGER: "State Manager",
  COUNTRY_MANAGER: "Country Manager",
};

export const roleLabel = (role) => {
  const key = String(
    typeof role === "object" && role
      ? role.value || role.id || role.name || ""
      : role || "",
  )
    .trim()
    .toUpperCase();

  if (!key) return "-";
  return ROLE_NAMES[key] || key;
};
