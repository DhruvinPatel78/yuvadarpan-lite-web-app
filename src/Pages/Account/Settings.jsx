import React, { useRef, useState } from "react";
import { Box, Button, CircularProgress, Grid, Paper } from "@mui/material";
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

  return (
    <Box>
      <Header />
      <ContainerPage className={"flex-col justify-center flex items-start gap-3"}>
        <p className={"text-3xl font-bold"}>Settings</p>
        <Paper elevation={3} className={"w-full max-w-[560px] p-6 rounded-2xl"}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <p className={"text-xl font-semibold text-[#572a2a]"}>
                Change Password
              </p>
            </Grid>
            {step === "send" ? (
              <>
                <Grid item xs={12}>
                  <p>
                    An OTP will be sent to your registered email{" "}
                    <span className={"font-bold text-[#572a2a]"}>{email}</span>
                  </p>
                </Grid>
                <Grid item xs={12} className={"flex justify-end"}>
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <Button
                      variant="contained"
                      className={"bg-[#572a2a] text-white px-6 py-3 rounded-lg font-bold"}
                      onClick={handleSendOtp}
                      disabled={!email}
                    >
                      Send OTP
                    </Button>
                  )}
                </Grid>
              </>
            ) : null}
            {step === "otp" ? (
              <>
                <Grid item xs={12}>
                  <p className={"text-center"}>
                    Enter OTP Code sent to{" "}
                    <span className={"text-primary font-bold"}>{email}</span>
                  </p>
                </Grid>
                <Grid item xs={12}>
                  <OTPInput
                    length={6}
                    onComplete={(value) => setOtp(value)}
                    ref={otpRef}
                  />
                </Grid>
                <Grid item xs={12}>
                  <p className="flex justify-center text-sm cursor-default">
                    Didn't receive OTP Code?
                    <span
                      className={"px-1 font-black text-[#572a2a] underline cursor-pointer"}
                      onClick={handleSendOtp}
                    >
                      Resend
                    </span>
                  </p>
                </Grid>
                <Grid item xs={12} className={"flex justify-end"}>
                  {loading ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    <Button
                      variant="contained"
                      className={"bg-[#572a2a] text-white px-6 py-3 rounded-lg font-bold"}
                      onClick={handleVerifyOtp}
                      disabled={otp?.length !== 6}
                    >
                      Verify OTP
                    </Button>
                  )}
                </Grid>
              </>
            ) : null}
            {step === "password" ? (
              <Grid item xs={12}>
                <FormikProvider value={formik}>
                  <Form>
                    <Grid container spacing={2}>
                      <CustomInput
                        type={"password"}
                        xs={12}
                        label={"New Password"}
                        placeholder={"Create Your Password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={touched.password && errors.password}
                      />
                      <CustomInput
                        type={"password"}
                        xs={12}
                        label={"Confirm Password"}
                        placeholder={"Confirm your Password"}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={touched.confirmPassword && errors.confirmPassword}
                      />
                      <Grid item xs={12} className={"flex justify-end"}>
                        {loading ? (
                          <CircularProgress color="secondary" />
                        ) : (
                          <button
                            className={`bg-[#572a2a] text-white px-6 py-3 rounded-lg font-bold ${
                              hasError ? "opacity-50" : "opacity-100"
                            }`}
                            type={"submit"}
                            disabled={hasError || isSubmitting}
                          >
                            Change Password
                          </button>
                        )}
                      </Grid>
                    </Grid>
                  </Form>
                </FormikProvider>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
      </ContainerPage>
      <NotificationSnackbar notification={notification} />
    </Box>
  );
}
