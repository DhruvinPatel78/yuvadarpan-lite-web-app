import { endLoading, startLoading } from "../store/authSlice";

export const completeModalMutation = async (
  dispatch,
  { mutate, refresh, close } = {}
) => {
  await mutate();
  dispatch(startLoading());
  try {
    if (refresh) {
      await refresh();
    }
  } finally {
    dispatch(endLoading());
  }
  close?.();
};
