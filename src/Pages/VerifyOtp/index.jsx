import { Button, Grid, Paper } from "@mui/material";
import OTPInput from "../../Component/Common/OTPInput";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import useAxios from "../../util/useAxios";

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { notification, setNotification } = NotificationData();
  const submitHandler = async () => {
    try {
      await useAxios
        .post(`/user/verifyOtp`, {
          email: location.state?.email,
          otp: otp,
        })
        .then(() => {
          setNotification({
            message: "OTP Verify Successfully",
            type: "success",
          });
          navigate("/forget-password", {
            state: { email: location.state?.email },
          });
        })
        .catch((err) => {
          setNotification({
            message: err.response.data.message,
            type: "error",
          });
        });
    } catch (err) {
      setNotification({
        message: err.response.data.message,
        type: "error",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary font-bold text-2xl">
              OTP Verification
            </p>
          </Grid>
          <Grid item xs={12}>
            <p className={"text-center"}>
              Enter OTP Code sent to{" "}
              <span className={"text-primary font-bold"}>
                {location?.state?.email || "test@gmail.com"}
              </span>
            </p>
          </Grid>
          <Grid item xs={12}>
            <OTPInput length={6} onComplete={(otp) => setOtp(otp)} />
          </Grid>
          <Grid item xs={12}>
            <p className="flex justify-center text-sm sm:text-lg cursor-default">
              Don't receive OTP Code?
              <span
                className={`px-1 font-black text-[#572a2a] underline text-sm sm:text-lg cursor-pointer`}
              >
                Resend
              </span>
            </p>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={
                "pointer-events-auto bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center disabled:cursor-not-allowed"
              }
              onClick={submitHandler}
              disabled={otp?.length === 0}
            >
              Verify OTP Code
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
