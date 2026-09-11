import { Grid } from "@mui/material";
import OTPInput from "../../Component/Common/OTPInput";
import { AuthShell, Button } from "../../Component/UI";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { verifyOtp, resendOtp } from "../../util/authApi";

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { notification, setNotification } = NotificationData();
  const dispatch = useDispatch();
  const otpRef = useRef();

  const submitHandler = async () => {
    try {
      await verifyOtp(location.state?.email, otp);
      setNotification({
        message: "OTP Verify Successfully",
        type: "success",
      });
      setTimeout(() => {
        navigate("/forget-password", {
          state: { email: location.state?.email },
        });
      }, 2000);
    } catch (err) {
      setNotification({
        message: err?.response?.data?.message || "OTP verification failed.",
        type: "error",
      });
      handleReset();
    }
  };

  const handleReset = () => {
    otpRef.current?.resetOtp();
  };

  const resendOTP = async () => {
    dispatch(startLoading());
    const email = location.state?.email;
    handleReset();
    try {
      await resendOtp(email);
      dispatch(endLoading());
      setNotification({
        message: "OTP Send Successfully",
        type: "success",
      });
    } catch (err) {
      dispatch(endLoading());
      setNotification({
        message: err?.response?.data?.message || "Failed to resend OTP.",
        type: "error",
      });
    }
  };

  return (
    <>
    <AuthShell>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p className="text-center text-primary font-semibold text-[22px] leading-tight">
            Verify your email
          </p>
          <p className={"text-center text-sm text-mutedText mt-1.5"}>
            Enter OTP Code sent to{" "}
            <span className={"text-primary font-semibold break-all"}>
              {location?.state?.email || "test@gmail.com"}
            </span>
          </p>
        </Grid>
        <Grid item xs={12}>
          <OTPInput
            length={6}
            onComplete={(otp) => setOtp(otp)}
            ref={otpRef}
          />
        </Grid>
        <Grid item xs={12}>
          <p className="flex justify-center flex-wrap text-sm cursor-default text-mutedText">
            Don't receive OTP Code?
            <span
              className={`px-1 font-semibold text-primary underline text-sm cursor-pointer`}
              onClick={() => resendOTP()}
            >
              Resend
            </span>
          </p>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            onClick={submitHandler}
            disabled={otp?.length === 0}
          >
            Verify OTP Code
          </Button>
        </Grid>
      </Grid>
    </AuthShell>
      <NotificationSnackbar notification={notification} />
    </>
  );
}
