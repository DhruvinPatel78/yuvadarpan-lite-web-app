import { login } from "../../store/authSlice";

export const persistUpdatedUser = (dispatch, currentUser, updates) => {
  const nextUser = {
    ...currentUser,
    ...updates,
    token: currentUser?.token,
  };
  localStorage.setItem("user", JSON.stringify(nextUser));
  dispatch(login(nextUser));
};
