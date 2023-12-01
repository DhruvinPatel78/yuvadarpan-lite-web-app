import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NotificationData } from "../Common/notification";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

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
      headerName: "Action",
      width: 150,
      flex: 1,
      headerClassName: "bg-[#572a2a] text-white place-content-center",
      cellClassName: "items-center flex px-8",
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
        </div>
      ),
    },
  ];
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userData, setRequestData] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    console.log("useEffect");
    handleUserList();
  }, []);

  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const userInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const handleUserList = () => {
    console.log("handleUserList");
    const ref = query(collection(db, "users"));
    getDocs(ref).then((res) => {
      console.log(
        "res === >>> ",
        res.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      );
      setUserList(res.docs?.map((doc) => ({ ...doc?.data(), id: doc.id })));
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
