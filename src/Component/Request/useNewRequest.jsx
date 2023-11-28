import { useState } from "react";

const useNewRequest = () => {
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  return {
    requestInfoModel,
    requestData,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
    },
  };
};

export default useNewRequest;
