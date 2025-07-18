import { Grid, Paper } from "@mui/material";
import React from "react";
import CustomInput from "../../Component/Common/customInput";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const { notification, setNotification } = NotificationData();
  const { loading } = UseRedux();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      dispatch(startLoading());
      if (
        values.password !== "" &&
        values.confirmPassword !== "" &&
        values.password === values.confirmPassword
      ) {
        try {
          await useAxios
            .patch(`/user/forgotPassword`, {
              email: location.state?.email,
              password: values.password,
            })
            .then((res) => {
              setNotification({
                message: res.data.message,
                type: "success",
              });
              setTimeout(() => {
                resetForm();
                dispatch(endLoading);
                navigate("/login");
              }, 2000);
            })
            .catch((err) => {
              setNotification({
                message: err.response.data.message,
                type: "error",
              });
              dispatch(endLoading);
            });
        } catch (err) {
          setNotification({
            message: err.response.data.message,
            type: "error",
          });
          dispatch(endLoading);
        }
      } else {
        setNotification({
          message: `confirm password not matched !`,
          type: "error",
        });
        dispatch(endLoading);
      }
    },
  });
  const { isSubmitting, errors, values, touched, handleChange, handleBlur } =
    formik;

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
                  Change Password
                </p>
              </Grid>
              <CustomInput
                type={"password"}
                xs={12}
                label={"New Password"}
                placeholder={"Create Your Password"}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.password && errors.password && errors.password}
                value={values.password}
              />
              <CustomInput
                type={"password"}
                xs={12}
                label={"Confirm Password"}
                placeholder={"Confirm your Password"}
                name="confirmPassword"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                errors={
                  touched.confirmPassword &&
                  errors.confirmPassword &&
                  errors.confirmPassword
                }
              />
              <Grid item xs={12}>
                <button
                  className={`bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-semibold ${
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={isSubmitting || loading}
                >
                  Change Password
                </button>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Paper>
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
