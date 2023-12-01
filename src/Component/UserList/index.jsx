import React from "react";
import CustomTable from "../Common/customTable";
import { Box, Grid, Modal, Paper } from "@mui/material";
import CustomTextFieldInfo from "../Common/customTextFieldInfo";
import useUserList from "./useUserList";
import Header from "../Common/header";
import { NotificationSnackbar } from "../Common/notification";

function Index() {
  const {
    notification,
    userInfoModel,
    userData,
    usersTableHeader,
    userList,
    action: { userInfoModalClose },
  } = useUserList();

  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div className={"p-4 pb-0 justify-between flex items-center"}>
        <p className={"text-3xl font-bold"}>Users</p>
      </div>
      <CustomTable
        columns={usersTableHeader}
        data={userList}
        name={"users"}
        pageSize={10}
        type={"userList"}
      />
      <Modal
        open={userInfoModel}
        onClose={userInfoModalClose}
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
              value={userData?.familyId}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"First Name"}
              value={userData?.firstName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Middle Name"}
              value={userData?.middleName}
            />
            <CustomTextFieldInfo
              grid={4}
              label={"Last Name"}
              value={userData?.lastName}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"E-mail"}
              value={userData?.email}
            />
            <CustomTextFieldInfo
              grid={6}
              label={"Mobile"}
              value={userData?.mobile}
            />
          </Grid>
        </Paper>
      </Modal>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}

export default Index;
