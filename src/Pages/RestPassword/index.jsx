import { Grid, Paper } from "@mui/material";
import React from "react";
import CustomInput from "../../Component/Common/customInput";
import { useNavigate } from "react-router-dom";
import useAxios from "../../util/useAxios";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UseRedux } from "../../Component/useRedux";
import { endLoading, startLoading } from "../../store/authSlice";
import { useDispatch } from "react-redux";

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
          },
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(startLoading());
      const email = values.email;
      try {
        await useAxios
          .post(`/user/sendOtp`, {
            email,
          })
          .then(() => {
            dispatch(endLoading());
            setNotification({
              message: "OTP Send Successfully",
              type: "success",
            });
            navigate("/verify-opt", { state: { email: email } });
            resetForm();
          })
          .catch((err) => {
            dispatch(endLoading());
            setNotification({
              message: err.response.data.message,
              type: "error",
            });
          });
      } catch (err) {
        dispatch(endLoading());
        setNotification({
          message: err.response.data.message,
          type: "error",
        });
      }
    },
  });
  const { errors, values, touched, handleChange, handleBlur } = formik;

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="text-center text-primary font-bold text-2xl">
                  Reset your password
                </p>
              </Grid>
              <CustomInput
                type={"text"}
                xs={12}
                label={"Email OR Mobile"}
                placeholder={"Enter Your Email OR Mobile"}
                name="email"
                disabled={loading}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errors={touched.email && errors.email && errors.email}
              />
              <Grid item xs={12}>
                <button
                  className={
                    "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center"
                  }
                >
                  Send OTP
                </button>
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
      </Paper>
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
