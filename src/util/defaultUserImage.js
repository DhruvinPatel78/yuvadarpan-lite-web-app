export const DEFAULT_USER_IMAGE = `${process.env.PUBLIC_URL || ""}/default-user.svg`;

export const getUserImageSrc = (url) => {
  const value = typeof url === "string" ? url.trim() : "";
  return value || DEFAULT_USER_IMAGE;
};
