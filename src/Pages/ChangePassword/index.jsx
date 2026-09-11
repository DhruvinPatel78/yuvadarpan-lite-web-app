import { Grid } from "@mui/material";
import React from "react";
import CustomInput from "../../Component/Common/customInput";
import { AuthShell, Button } from "../../Component/UI";
import { useLocation, useNavigate } from "react-router-dom";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UseRedux } from "../../Component/useRedux";
import { endLoading, startLoading } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { changePassword } from "../../util/authApi";

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
          const res = await changePassword(
            location.state?.email,
            values.password
          );
          setNotification({
            message: res.message,
            type: "success",
          });
          setTimeout(() => {
            resetForm();
            dispatch(endLoading());
            navigate("/login");
          }, 2000);
        } catch (err) {
          setNotification({
            message: err?.response?.data?.message || "Password change failed.",
            type: "error",
          });
          dispatch(endLoading());
        }
      } else {
        setNotification({
          message: `confirm password not matched !`,
          type: "error",
        });
        dispatch(endLoading());
      }
    },
  });
  const { isSubmitting, errors, values, touched, handleChange, handleBlur } =
    formik;

  return (
    <>
    <AuthShell>
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p className="text-center text-primary font-semibold text-[22px] leading-tight">
                  Change password
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
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting || loading}
                  loading={isSubmitting || loading}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
    </AuthShell>
      <NotificationSnackbar notification={notification} />
    </>
  );
}
