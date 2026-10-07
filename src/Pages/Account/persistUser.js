import { login } from "../../store/authSlice";

const omitUndefined = (value = {}) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  );

export const persistUpdatedUser = (dispatch, currentUser, updates) => {
  const nextUser = {
    ...currentUser,
    ...omitUndefined(updates),
    token: currentUser?.token,
  };
  localStorage.setItem("user", JSON.stringify(nextUser));
  dispatch(login(nextUser));
};
