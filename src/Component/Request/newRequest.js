import React from "react";
import { Box, Button, Grid, Modal, Paper, Tooltip } from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import CustomTable from "../Common/customTable";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../Common/header";
import CustomTextFieldInfo from "../Common/customTextFieldInfo";
import useNewRequest from "./useNewRequest";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NotificationSnackbar } from "../Common/notification";

export default function NewRequest() {
  const {
    requestInfoModel,
    requestData,
    requests,
    notification,
    action: {
      requestInfoModalOpen,
      requestInfoModalClose,
      handleRequestAccept,
    },
  } = useNewRequest();

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
      flex: 2,
      headerClassName: "bg-[#572a2a] text-white place-content-center",
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

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div className="pt-4 pr-4 text-end ">
        <Tooltip title={"Accept all selected"}>
          <button
            className={
              "bg-[#572a2a] border text-white rounded p-2 hover:scale-105"
            }
          >
            <PlaylistAddCheckIcon />
          </button>
        </Tooltip>
        <Tooltip title={"Reject all selected"} className="ml-3">
          <button
            className={
              "bg-white text-[#572a2a] border border-[#572a2a] rounded p-2 hover:scale-105"
            }
          >
            <PlaylistRemoveIcon />
          </button>
        </Tooltip>
      </div>
      <CustomTable
        columns={pendingUsersTableHeader}
        data={requests}
        name={"pendingUser"}
        pageSize={10}
        type={"pendingList"}
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
              grid={4}
              label={"First Name"}
              value={requestData?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={requestData?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={requestData?.lastName}
            />
            <CustomTextFieldInfo
              grid={12}
              label={"E-mail"}
              value={requestData?.email}
            />
          </Grid>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
