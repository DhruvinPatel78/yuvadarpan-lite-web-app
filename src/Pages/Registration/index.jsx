import React from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useNavigate } from "react-router-dom";
import useAxios from "../../util/useAxios";
import moment from "moment";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

export default function Index() {
  const navigate = useNavigate();
  const { notification, setNotification } = NotificationData();
  const handleSubmit = (value) => {
    if (value.password === value.confirmPassword) {
      try {
        useAxios
          .post("/user/signUp", {
            familyId: value?.familyId,
            firstName: value?.firstName,
            middleName: value?.middleName,
            lastName: value?.lastName,
            email: value?.email,
            mobile: value?.mobile,
            password: value?.password,
            dob: moment(value?.dob).format(),
            active: true,
            allowed: false,
            role: "USER",
          })
          .then((res) => {
            setNotification({ type: "success", message: "Success !" });
            navigate("/thankyou");
          });
      } catch (e) {
        setNotification({
          type: "error",
          message: e.response.data.message,
        });
      }
    } else {
      setNotification({
        type: "error",
        message: "confirm password not matched !",
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      familyId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      regin: "",
      localSamaj: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      familyId: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      localSamaj: Yup.string().required("Required"),
      regin: Yup.string().required("Required"),
      email: Yup.string()
        .matches(
          "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
          "Invalid email address format"
        )
        .required("Required"),
      mobile: Yup.string()
        .matches("^(\\+\\d{1,3}[- ]?)?\\d{10}$", "Phone Number must be correct")
        .required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string().required("Required"),
      dob: Yup.date().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
    },
  });
  const { isSubmitting, errors, values, touched, handleChange, handleBlur } =
    formik;
  return (
    <Grid className="h-screen flex justify-center items-center">
      <Paper
        elevation={20}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[600px] max-h-[90%] overflow-auto"
      >
        <FormikProvider value={formik}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  className="text-center text-[#542b2b] font-bold text-2xl sm:text-4xl"
                  variant="h3"
                >
                  Registration
                </Typography>
              </Grid>
              <CustomInput
                type={"text"}
                xs={12}
                md={4}
                label={"First Name"}
                placeholder={"Enter Your First Name"}
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
                errors={
                  touched.firstName && errors.firstName && errors.firstName
                }
              />
              <CustomInput
                type={"text"}
                xs={12}
                md={4}
                label={"Middle Name"}
                placeholder={"Enter Your Middle Name"}
                name="middleName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.middleName}
                errors={
                  touched.middleName && errors.middleName && errors.middleName
                }
              />
              <CustomInput
                type={"text"}
                xs={12}
                md={4}
                label={"Last Name"}
                placeholder={"Enter Your Last Name"}
                name="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.lastName && errors.lastName && errors.lastName}
                value={values.lastName}
              />
              <CustomInput
                type={"text"}
                xs={12}
                md={6}
                label={"Email"}
                placeholder={"Enter Your Email"}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.email && errors.email && errors.email}
                value={values.email}
              />
              <CustomInput
                type={"number"}
                xs={12}
                md={6}
                label={"Mobile"}
                placeholder={"Enter Your Mobile"}
                name="mobile"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.mobile && errors.mobile && errors.mobile}
                value={values.mobile}
              />
              <CustomInput
                type={"password"}
                xs={12}
                md={6}
                label={"Password"}
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
                md={6}
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
              <CustomInput
                type={"text"}
                xs={12}
                md={6}
                label={"Regin"}
                placeholder={"Enter Your Regin"}
                name="regin"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.regin && errors.regin && errors.regin}
                value={values.regin}
              />{" "}
              <CustomInput
                type={"text"}
                xs={12}
                md={6}
                label={"Local Samaj"}
                placeholder={"Enter Your Samaj"}
                name="localSamaj"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={
                  touched.localSamaj && errors.localSamaj && errors.localSamaj
                }
                value={values.localSamaj}
              />
              <CustomInput
                type={"number"}
                xs={6}
                label={"Family Id"}
                placeholder={"Enter Your Family Id"}
                name="familyId"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.familyId && errors.familyId && errors.familyId}
                value={values.familyId}
              />
              <CustomInput
                type={"date"}
                xs={6}
                label={"DOB"}
                placeholder={"Select Your DOB"}
                name="dob"
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.dob && errors.dob && errors.dob}
                value={values.dob}
                focused
              />
              <Grid item xs={12}>
                <button
                  className={`bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-semibold ${
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </Grid>
              <Grid item xs={12}>
                <Typography className="flex justify-center flex-wrap">
                  Do you have an account ?
                  <Link
                    href={"/login"}
                    className="px-1 !text-[#572a2a] !no-underline font-semibold"
                  >
                    Sign In
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Paper>
      <NotificationSnackbar notification={notification} />
    </Grid>
  );
}
