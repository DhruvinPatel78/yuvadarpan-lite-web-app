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
import { UseRedux } from "../../Component/useRedux";

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { notification, setNotification } = NotificationData();
  const dispatch = useDispatch();
  const { loading } = UseRedux();
  const otpRef = useRef();
  const email = location.state?.email || "";

  const handleReset = () => {
    setOtp("");
    otpRef.current?.resetOtp();
  };

  const submitHandler = async () => {
    dispatch(startLoading());
    if (otp.length !== 6 || submitting) return;
    setSubmitting(true);
    try {
      await verifyOtp(location.state?.email, otp);
      dispatch(endLoading());
      setNotification({
        message: "OTP verified.",
        type: "success",
      });
      navigate("/forget-password", {
        state: { email: location.state?.email },
      });
    } catch (err) {
      dispatch(endLoading());
      setNotification({
        message: err?.response?.data?.message || "OTP verification failed.",
        type: "error",
      });
      handleReset();
      setSubmitting(false);
    }
  };

  const resendOTP = async () => {
    dispatch(startLoading());
    const email = location.state?.email;
    handleReset();
    try {
      await resendOtp(email);
      dispatch(endLoading());
      setNotification({
        message: "OTP sent.",
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
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-primary font-semibold text-[22px] leading-tight">
              Verify your email
            </p>
            <p className="text-sm text-mutedText mt-1.5">
              Enter the 6-digit code we sent to
            </p>
            <div className="mt-3 rounded-lg bg-muted px-3 py-2.5">
              <p className="text-[13px] font-semibold text-primary leading-snug break-all">
                {email || "your email"}
              </p>
            </div>
          </div>
          <OTPInput
            length={6}
            onChange={(value) => setOtp(value)}
            ref={otpRef}
          />
          <p className="text-center text-sm text-mutedText">
            Didn't get a code?
            <button
              type="button"
              className="ml-1 font-semibold text-primary underline underline-offset-2"
              onClick={resendOTP}
            >
              Resend
            </button>
          </p>
          <Button
            fullWidth
            onClick={submitHandler}
            disabled={otp?.length === 0 || loading}
            loading={loading}
          >
            Verify code
          </Button>
          <a
            href="/login"
            className="text-primary text-sm w-full flex justify-center hover:underline"
          >
            Return to sign in
          </a>
        </div>
      </AuthShell>
      <NotificationSnackbar notification={notification} />
    </>
  );
}
