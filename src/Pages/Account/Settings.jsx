import React, { useRef, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import Header from "../../Component/Header";
import ContainerPage from "../../Component/Container";
import CustomInput from "../../Component/Common/customInput";
import OTPInput from "../../Component/Common/OTPInput";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { endLoading, startLoading } from "../../store/authSlice";
import { UseRedux } from "../../Component/useRedux";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import {
  sendChangePasswordOtp,
  verifyOtp,
  changePasswordWithOtp,
} from "../../util/authApi";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { PageHeader, Card, Button } from "../../Component/UI";

export default function Settings() {
  const dispatch = useDispatch();
  const { loading, auth } = UseRedux();
  const { notification, setNotification } = NotificationData();
  const user = auth?.user;
  const email = user?.email || "";
  const [step, setStep] = useState("send");
  const [otp, setOtp] = useState("");
  const otpRef = useRef();

  const showError = (err, fallback) => {
    setNotification({
      message: err?.response?.data?.message || fallback,
      type: "error",
    });
  };

  const handleSendOtp = async () => {
    dispatch(startLoading());
    try {
      await sendChangePasswordOtp();
      setStep("otp");
      setOtp("");
      otpRef.current?.resetOtp();
      setNotification({
        message: "OTP sent to your registered email",
        type: "success",
      });
    } catch (err) {
      showError(err, "Failed to send OTP.");
    } finally {
      dispatch(endLoading());
    }
  };

  const handleVerifyOtp = async () => {
    dispatch(startLoading());
    try {
      await verifyOtp(email, otp);
      setStep("password");
      setNotification({
        message: "OTP verified successfully",
        type: "success",
      });
    } catch (err) {
      showError(err, "OTP verification failed.");
      otpRef.current?.resetOtp();
      setOtp("");
    } finally {
      dispatch(endLoading());
    }
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(startLoading());
      try {
        await changePasswordWithOtp(values.password);
        setNotification({
          message: "Password updated successfully",
          type: "success",
        });
        resetForm();
        setStep("send");
        setOtp("");
      } catch (err) {
        showError(err, "Password update failed.");
      } finally {
        dispatch(endLoading());
      }
    },
  });

  const { errors, values, touched, handleChange, handleBlur, isSubmitting } =
    formik;
  const hasError = Object.keys(errors)?.length || 0;

  const stepCopy = {
    send: "Verify your email before choosing a new password.",
    otp: "Enter the code we sent to your email.",
    password: "Choose a new password for your account.",
  };

  return (
    <Box>
      <Header />
      <ContainerPage className={"flex-col justify-center flex items-start pb-8"}>
        <PageHeader
          title="Settings"
          description="Manage your password and protect your account."
        />
        <Card className="w-full">
          <h2 className="text-base font-semibold text-primary">
            Change password
          </h2>
          <p className="text-sm text-mutedText mt-1 mb-5">{stepCopy[step]}</p>
          {step === "send" ? (
            <>
              <p className="text-sm text-gray-600 bg-muted rounded-lg px-3.5 py-3">
                Verification code will be sent to{" "}
                <span className="font-semibold text-primary break-all">
                  {email || "your registered email"}
                </span>
              </p>
              <div className="flex justify-end mt-5">
                {loading ? (
                  <CircularProgress color="secondary" size={28} />
                ) : (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!email}
                    icon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
                  >
                    Send OTP
                  </Button>
                )}
              </div>
            </>
          ) : null}
          {step === "otp" ? (
            <>
              <div className="flex items-start gap-2.5 bg-muted rounded-lg px-3.5 py-3">
                <CheckCircleOutlineIcon
                  fontSize="small"
                  className="text-primary mt-0.5 shrink-0"
                />
                <div className="text-sm min-w-0">
                  <p className="font-semibold text-primary">
                    OTP sent successfully
                  </p>
                  <p className="text-mutedText mt-0.5">
                    Check{" "}
                    <span className="font-medium text-primary break-all">
                      {email}
                    </span>{" "}
                    for your 6-digit code.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <p className="font-semibold text-primary text-sm">
                  Enter verification code
                </p>
                <p className="text-sm text-mutedText mt-0.5 mb-4">
                  The code expires shortly for your security.
                </p>
                <OTPInput
                  length={6}
                  onComplete={(value) => setOtp(value)}
                  ref={otpRef}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 mt-6">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
                  onClick={handleSendOtp}
                >
                  <RefreshIcon sx={{ fontSize: 18 }} />
                  Resend code
                </button>
                {loading ? (
                  <CircularProgress color="secondary" size={28} />
                ) : (
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp?.length !== 6}
                    icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />}
                  >
                    Verify OTP
                  </Button>
                )}
              </div>
            </>
          ) : null}
          {step === "password" ? (
            <FormikProvider value={formik}>
              <Form>
                <Grid container spacing={2}>
                  <CustomInput
                    type={"password"}
                    xs={12}
                    label={"New password"}
                    placeholder={"Create your password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={touched.password && errors.password}
                  />
                  <CustomInput
                    type={"password"}
                    xs={12}
                    label={"Confirm password"}
                    placeholder={"Confirm your password"}
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                  <Grid item xs={12} className={"flex justify-end"}>
                    {loading ? (
                      <CircularProgress color="secondary" size={28} />
                    ) : (
                      <Button
                        type="submit"
                        disabled={hasError || isSubmitting}
                      >
                        Change password
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          ) : null}
        </Card>
        <p className="text-sm text-mutedText mt-4 w-full leading-relaxed">
          We use a one-time code to confirm it's really you before your password
          is changed.
        </p>
      </ContainerPage>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
