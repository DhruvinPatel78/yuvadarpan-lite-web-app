import React from "react";
import { CircularProgress, Grid, Link, Paper } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import { useNavigate } from "react-router-dom";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useDispatch } from "react-redux";
import { login, startLoading, endLoading } from "../../store/authSlice";
import {
  getAllRegionData,
  getAllCityData,
  getAllDistrictData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
  getAllCountryData,
  getAllRoleData,
} from "../../util/getAPICall";
import useAxios from "../../util/useAxios";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UseRedux } from "../../Component/useRedux";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = UseRedux();
  const { notification, setNotification } = NotificationData();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (values.email && values.password) {
        dispatch(startLoading());
        useAxios
          .post(`/user/signIn`, {
            ...values,
          })
          .then((res) => {
            localStorage.setItem("user", JSON.stringify(res?.data?.data));
            localStorage.setItem("token", res?.data?.token);
            setNotification({ message: "Login Success", type: "success" });
            setTimeout(() => {
              dispatch(endLoading());
              if (res.data?.data?.role === "USER") {
                dispatch(getAllCityData);
              } else {
                dispatch(getAllRegionData);
                dispatch(getAllCityData);
                dispatch(getAllDistrictData);
                dispatch(getAllSamajData);
                dispatch(getAllStateData);
                dispatch(getAllSurnameData);
                dispatch(getAllCountryData);
                dispatch(getAllRoleData);
              }
              dispatch(login({ ...res?.data?.data, token: res?.data?.token }));
            }, 1000);
            resetForm();
          })
          .catch((err) => {
            setTimeout(() => {
              dispatch(endLoading());
              setNotification({
                message: err.response.data.message,
                type: err.response.status === "403" ? "warning" : "error",
              });
            }, 1000);
          });
      } else {
        setNotification({
          message:
            !values.email && !values.password
              ? "Email and Password are required."
              : !values.email
                ? "Email is required."
                : "Password is required.",
          type: "error",
        });
      }
    },
  });
  const { errors, values, touched, handleChange, handleBlur } = formik;

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-center text-primary text-3xl mb-10 font-extrabold font-WorkBold">
        YUVADARPAN
      </p>
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="text-center text-primary font-bold text-2xl">
                  Sign In
                </p>
              </Grid>
              <CustomInput
                type={"text"}
                xs={12}
                label={"Username"}
                placeholder={"Enter Your Username"}
                name="email"
                disabled={loading}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errors={touched.email && errors.email && errors.email}
              />
              <CustomInput
                type={"password"}
                xs={12}
                label={"Password"}
                placeholder={"Enter Your Password"}
                name="password"
                disabled={loading}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errors={touched.password && errors.password && errors.password}
              />
              <Grid item xs={12}>
                <button
                  className={
                    "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center"
                  }
                  style={
                    values.password && values.email
                      ? { cursor: "pointer", opacity: "unset" }
                      : { disabled: true, cursor: "not-allowed", opacity: 0.5 }
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={25} />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </Grid>
              <Grid item xs={12}>
                <Link
                  href={"/reset-password"}
                  className="px-1 !text-[#572a2a] !no-underline font-semibold"
                >
                  Forgot Password ?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <p className="flex justify-center text-sm sm:text-lg cursor-default">
                  Create a new account?
                  <span
                    className={`px-1 font-black text-[#572a2a] underline text-sm sm:text-lg cursor-pointer`}
                    onClick={() => (loading ? {} : navigate("/register"))}
                    style={loading ? { opacity: 0.5 } : { opacity: "unset" }}
                  >
                    Registration
                  </span>
                </p>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Paper>
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
