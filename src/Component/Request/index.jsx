import React from "react";
import { Box, Grid, Modal, Paper, Tooltip } from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import CustomTable from "../Common/customTable";
import Header from "../Header";
import CustomTextFieldInfo from "../Common/customTextFieldInfo";
import useRequest from "./useRequest";
import { NotificationSnackbar } from "../Common/notification";

export default function Index() {
  const {
    requestInfoModel,
    requestData,
    requests,
    notification,
    pendingUsersTableHeader,
    action: { requestInfoModalClose, handleSelectedUser, handleRequestAcceptAll },
  } = useRequest();

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
              onClick={handleRequestAcceptAll}
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
      </div>
      <CustomTable
        columns={pendingUsersTableHeader}
        data={requests}
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
              value={requestData?.familyId}
            />
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
              grid={6}
              label={"E-mail"}
              value={requestData?.email}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Mobile"}
              value={requestData?.mobile}
            />
          </Grid>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
