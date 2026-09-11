import { Grid } from "@mui/material";
import React from "react";
import CustomInput from "../../Component/Common/customInput";
import { AuthShell, Button } from "../../Component/UI";
import { useNavigate } from "react-router-dom";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UseRedux } from "../../Component/useRedux";
import { endLoading, startLoading } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { sendOtp } from "../../util/authApi";

export default function Index() {
  const navigate = useNavigate();
  const { notification, setNotification } = NotificationData();
  const { loading } = UseRedux();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Required")
        .test(
          "email-or-phone",
          "Must be a valid email or phone number",
          function (value) {
            const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
          }
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(startLoading());
      const email = values.email;
      try {
        await sendOtp(email);
        dispatch(endLoading());
        setNotification({
          message: "OTP Send Successfully",
          type: "success",
        });
        navigate("/verify-opt", { state: { email: email } });
        resetForm();
      } catch (err) {
        dispatch(endLoading());
        setNotification({
          message: err?.response?.data?.message || "Failed to send OTP.",
          type: "error",
        });
      }
    },
  });
  const { errors, values, touched, handleChange, handleBlur } = formik;

  return (
    <>
    <AuthShell>
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="text-center text-primary font-semibold text-[22px] leading-tight">
                  Reset password
                </p>
                <p className="text-center text-sm text-mutedText mt-1.5 leading-relaxed max-w-[280px] mx-auto">
                  We'll send a verification code to your email or mobile.
                </p>
              </Grid>
              <CustomInput
                type={"text"}
                xs={12}
                label={"Email or mobile"}
                placeholder={"Enter your email or mobile"}
                name="email"
                disabled={loading}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errors={touched.email && errors.email && errors.email}
              />
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                >
                  Send OTP
                </Button>
              </Grid>
              <Grid item xs={12}>
                <a
                  href={"/login"}
                  className={
                    "text-primary w-full flex justify-center hover:underline"
                  }
                >
                  Return to sign in
                </a>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
    </AuthShell>
      <NotificationSnackbar notification={notification} />
    </>
  );
}
