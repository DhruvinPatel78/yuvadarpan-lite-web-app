import React, { useEffect, useState } from "react";
import { Alert } from "@mui/lab";
import { Snackbar } from "@mui/material";

const NotificationData = () => {
  const [notification, setNotification] = useState({ type: "", message: "" });
  return {
    notification,
    setNotification,
  };
};

const NotificationSnackbar = ({ notification }) => {
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (notification?.type && notification?.message) {
      setNotificationOpen(true);
    }
  }, [notification]);

  const notificationClose = () => {
    setNotificationOpen(false);
  };
  return (
    <Snackbar
      open={notificationOpen}
      autoHideDuration={2000}
      onClose={notificationClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={notificationClose}
        severity={notification?.type}
        sx={{ width: "100%" }}
      >
        {notification?.message === ""
          ? notification?.type === "error"
            ? "Something went wrong !"
            : "Success !"
          : notification?.message}
      </Alert>
    </Snackbar>
  );
};

export { NotificationData, NotificationSnackbar };
