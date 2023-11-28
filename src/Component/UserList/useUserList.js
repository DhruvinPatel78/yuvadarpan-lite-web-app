import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useUserList = () => {
  const navigate = useNavigate();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userData, setRequestData] = useState(null);
  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const userInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  return {
    navigate,
    userInfoModel,
    userData,
    action: { userInfoModalOpen, userInfoModalClose },
  };
};

export default useUserList;
