export const toCamelCase = (str = "") => {
  let result = str;
  if (result.length) {
    result = result[0].toUpperCase() + result.slice(1, result.length);
  }

  return result;
};

export const isRegularUser = (role) =>
  String(role || "").toUpperCase() === "USER";

export const isSamajManager = (role) =>
  String(role || "").toUpperCase() === "SAMAJ_MANAGER";
