import { endLoading, startLoading } from "../store/authSlice";
import { refreshMastersSilently } from "./getAPICall";

export const completeModalMutation = async (
  dispatch,
  { mutate, refresh, close, syncMasters } = {}
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
  if (syncMasters) {
    refreshMastersSilently(dispatch, syncMasters);
  }
};
