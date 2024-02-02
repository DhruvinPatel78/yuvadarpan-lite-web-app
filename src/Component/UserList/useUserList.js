import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NotificationData } from "../Common/notification";
import axios from "../../util/useAxios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const useUserList = () => {
  const usersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "action",
      headerName: "Active",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center justify-center flex px-8",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"Details"}>
            <Button
              variant="text"
              className={""}
              onClick={() => userInfoModalOpen(record.row)}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Accept"}>
            <Button
              variant="text"
              className={"!text-[#34c375]"}
              onClick={() => userAcceptRejectHandler(record.row, true)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Reject"}>
            <Button
              variant="text"
              className={"!text-[#ff0000]"}
              onClick={() => userAcceptRejectHandler(record.row, false)}
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  // eslint-disable-next-line no-unused-vars
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userData, setRequestData] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    handleUserList();
  }, []);

  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };

  const userAcceptRejectHandler = (userInfo, action) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${userInfo._id}`, {
        ...userInfo,
        allowed: action,
      })
      .then((res) =>
        setUserList(res?.data?.map((data) => ({ ...data, id: data?._id }))),
      );
  };

  const userInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const handleUserList = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/list`).then((res) => {
      setUserList(res.data.map((data) => ({ ...data, id: data?._id })));
    });
  };
  return {
    notification,
    userInfoModel,
    userData,
    usersTableHeader,
    userList,
    action: { userInfoModalOpen, userInfoModalClose, handleUserList },
  };
};

export default useUserList;
