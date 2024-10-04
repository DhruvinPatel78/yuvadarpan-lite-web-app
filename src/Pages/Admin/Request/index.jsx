import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Modal, Paper, Tooltip } from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import CustomTable from "../../../Component/Common/customTable";
import Header from "../../../Component/Header";
import CustomTextFieldInfo from "../../../Component/Common/customTextFieldInfo";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../../Component/Common/notification";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../../util/useAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const { notification, setNotification } = NotificationData();
  const [requestInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, []);

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

  const pendingUsersTableHeader = [
    {
      field: "familyId",
      headerName: "Family Id",
      width: 100,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      flex: 3,
      headerClassName: "bg-[#572a2a] text-white outline-none",
      cellClassName: "items-center flex px-8 outline-none",
      filterable: false,
      sortable: false,
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
              onClick={() => userActionHandler(record.row, true)}
            >
              <CheckIcon />
            </Button>
          </Tooltip>
          <Tooltip title={"Reject"}>
            <Button
              variant="text"
              className={"!text-[#ff0000]"}
              onClick={() => userActionHandler(record.row, false)}
            >
              <CloseIcon />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div className={"p-4 pb-0 justify-between flex items-center"}>
        <p className={"text-3xl font-bold"}>Pending Requests</p>
        <div className="">
          <Tooltip title={"Accept all selected"}>
            <button
              className={
                "bg-[#572a2a] border text-white rounded p-2 hover:scale-105"
              }
              onClick={() => handleRequestAll("accept")}
            >
              <PlaylistAddCheckIcon />
            </button>
          </Tooltip>
          <Tooltip title={"Reject all selected"} className="ml-3">
            <button
              className={
                "bg-white text-[#572a2a] border border-[#572a2a] rounded p-2 hover:scale-105"
              }
              onClick={() => handleRequestAll("reject")}
            >
              <PlaylistRemoveIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      <CustomTable
        columns={pendingUsersTableHeader}
        data={userList}
        name={"pendingUser"}
        pageSize={10}
        type={"pendingList"}
        onRowSelectionModelChange={(ids) => handleSelectedUser(ids)}
      />
      <Modal
        open={requestInfoModel}
        onClose={requestInfoModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          "& .MuiModal-backdrop": {
            backdropFilter: " blur(2px) !important",
            background: "#878b9499 !important",
          },
        }}
        className="flex justify-center items-center"
      >
        <Paper elevation={10} className="!rounded-2xl p-4 w-1/2">
          <Grid container spacing={2} className="p-4">
            <CustomTextFieldInfo
              grid={12}
              label={"Family Id"}
              value={selectedUser?.familyId}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"First Name"}
              value={selectedUser?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={selectedUser?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={selectedUser?.lastName}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"E-mail"}
              value={selectedUser?.email}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Mobile"}
              value={selectedUser?.mobile}
            />
          </Grid>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
