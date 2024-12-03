export const toCamelCase = (str = "") => {
  let result = str;
  if (result.length) {
    result = result[0].toUpperCase() + result.slice(1, result.length);
  }

  return result;
};
