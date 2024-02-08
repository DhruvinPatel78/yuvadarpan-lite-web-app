import { useEffect, useState } from "react";
import { NotificationData } from "../../Component/Common/notification";
import axios from "../../util/useAxios";

const useRequest = () => {
  const { notification, setNotification } = NotificationData();
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    handleRequestList();
  }, []);

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setSelectedUser(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const userActionHandler = (userInfo, action) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${userInfo._id}`, {
        ...userInfo,
        allowed: action,
      })
      .then((res) => {
        setUserList(res?.data?.map((data) => ({ ...data, id: data?._id })));
        setNotification({ type: "success", message: "Success !" });
      })
      .catch((e) => {
        setNotification({
          type: "error",
          message: e.message,
        });
      });
  };
  const handleRequestList = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/requests`).then((res) => {
      setUserList(res.data.map((data) => ({ ...data, id: data?._id })));
    });
  };
  const handleSelectedUser = (ids) => {
    console.log(ids);
    setSelectedUsers([...ids]);
  };
  const handleRequestAll = async (action) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/approveRejectMany`, {
        ids: selectedUsers,
        action,
      })
      .then((res) => {
        setUserList(res.data.map((data) => ({ ...data, id: data?._id })));
        setNotification({ type: "success", message: "Success !" });
      })
      .catch((e) => {
        setNotification({
          type: "error",
          message: e.message,
        });
      });
  };

  return {
    requestInfoModel,
    userList,
    selectedUser,
    notification,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
      userActionHandler,
      handleSelectedUser,
      handleRequestAll,
    },
  };
};

export default useRequest;
