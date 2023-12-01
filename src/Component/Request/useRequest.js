import React, { useEffect, useState } from "react";
import { updateDoc, collection, getDocs, query, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { NotificationData } from "../Common/notification";
import { Button, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const useRequest = () => {
  const pendingUsersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 3,
      headerClassName: "bg-[#572a2a] text-white",
      cellClassName: "items-center flex px-8",
      filterable: false,
      renderCell: (record) => (
        <div className={"flex gap-2"}>
          <Tooltip title={"Details"}>
            <Button
              variant="text"
              className={""}
              onClick={() => requestInfoModalOpen(record.row)}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Accept"}>
            <Button
              variant="text"
              className={"!text-[#34c375]"}
              onClick={() => handleRequestAccept(record.row)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Reject"}>
            <Button
              variant="text"
              className={"!text-[#ff0000]"}
              // onClick={() => handleOpenEditUser(record.row)}
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [requests, setRequests] = useState([]);
  const { notification, setNotification } = NotificationData();

  useEffect(() => {
    handleRequestList();
  }, []);

  const requestInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setRequestData(userInfo);
  };
  const requestInfoModalClose = () => {
    setRequestInfoModel(false);
  };
  const handleRequestAccept = (data) => {
    try {
      updateDoc(doc(db, "users", data.id), {
        active: true,
      });
      handleRequestList();
      setNotification({ type: "success", message: "Success !" });
    } catch (e) {
      setNotification({
        type: "error",
        message: e.message,
      });
    }
  };
  const handleRequestList = () => {
    const ref = query(collection(db, "users"));
    getDocs(ref).then((res) => {
      setRequests(
        res.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((data) => !data.active),
      );
    });
  };
  return {
    requestInfoModel,
    requestData,
    requests,
    notification,
    pendingUsersTableHeader,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
      handleRequestAccept,
    },
  };
};

export default useRequest;
