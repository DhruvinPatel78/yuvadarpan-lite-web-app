import React from "react";
import { Grid, Link } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import { AuthShell, Button } from "../../Component/UI";
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
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UseRedux } from "../../Component/useRedux";
import { loginUser } from "../../util/authApi";

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
          }
        ),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (values.email && values.password) {
        dispatch(startLoading());
        try {
          const res = await loginUser(values);
          localStorage.setItem("user", JSON.stringify(res?.data));
          localStorage.setItem("token", res?.token);
          setNotification({ message: "Login Success", type: "success" });
          setTimeout(() => {
            dispatch(endLoading());
            dispatch(getAllCityData);
            dispatch(getAllStateData);
            dispatch(getAllRegionData);
            dispatch(getAllDistrictData);
            dispatch(getAllSamajData);
            dispatch(getAllSurnameData);
            if (res.data?.role !== "USER") {
              dispatch(getAllCountryData);
              dispatch(getAllRoleData);
            }
            dispatch(login({ ...res?.data, token: res?.token }));
          }, 1000);
          resetForm();
        } catch (err) {
          setTimeout(() => {
            dispatch(endLoading());
            setNotification({
              message: err?.response?.data?.message || "Login failed.",
              type: err?.response?.status === 403 ? "warning" : "error",
            });
          }, 1000);
        }
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
    <>
    <AuthShell>
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <p className="text-center text-primary font-semibold text-[22px] leading-tight">
                  Sign in
                </p>
                <p className="text-center text-sm text-mutedText mt-1.5">
                  Use your email or mobile number
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
              <Grid item xs={12} className="flex justify-end !pt-0">
                <Link
                  href={"/reset-password"}
                  className="!text-sm !text-primary !no-underline font-medium"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading || !values.password || !values.email}
                  loading={loading}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item xs={12}>
                <p className="flex justify-center text-sm cursor-default text-mutedText">
                  New here?
                  <span
                    className="px-1 font-semibold text-primary underline cursor-pointer"
                    onClick={() => (loading ? {} : navigate("/register"))}
                    style={loading ? { opacity: 0.5 } : { opacity: "unset" }}
                  >
                    Create an account
                  </span>
                </p>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
    </AuthShell>
      <NotificationSnackbar notification={notification} />
    </>
  );
}
