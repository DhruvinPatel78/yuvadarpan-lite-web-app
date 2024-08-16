import React, { useState } from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useNavigate } from "react-router-dom";
import useAxios from "../../util/useAxios";
import moment from "moment";

export default function Index() {
  const navigate = useNavigate();
  const defaultValue = {
    familyId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmpassword: "",
    dob: "",
  };
  const [values, setValues] = useState(defaultValue);
  const { notification, setNotification } = NotificationData();
  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  console.log("values", values);
  const handleSubmit = () => {
    if (values.password === values.confirmpassword) {
      try {
        useAxios
          .post("/user/signUp", {
            familyId: values?.familyId,
            firstName: values?.firstName,
            middleName: values?.middleName,
            lastName: values?.lastName,
            email: values?.email,
            mobile: values?.mobile,
            password: values?.password,
            dob: moment(values?.dob).format(),
            active: true,
            allowed: false,
            role: "USER",
          })
          .then((res) => {
            setValues(defaultValue);
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
  return (
    <Grid className="h-screen flex justify-center items-center">
      <Paper
        elevation={20}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
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
            onChange={getUserData}
            value={values.firstName}
          />
          <CustomInput
            type={"text"}
            xs={12}
            md={4}
            label={"Middle Name"}
            placeholder={"Enter Your Middle Name"}
            name="middleName"
            onChange={getUserData}
            value={values.middleName}
          />
          <CustomInput
            type={"text"}
            xs={12}
            md={4}
            label={"Last Name"}
            placeholder={"Enter Your Last Name"}
            name="lastName"
            onChange={getUserData}
            value={values.lastName}
          />
          <CustomInput
            type={"text"}
            xs={12}
            md={6}
            label={"Email"}
            placeholder={"Enter Your Email"}
            name="email"
            onChange={getUserData}
            value={values.email}
          />
          <CustomInput
            type={"number"}
            xs={12}
            md={6}
            label={"Mobile"}
            placeholder={"Enter Your Mobile"}
            name="mobile"
            onChange={getUserData}
            value={values.mobile}
          />
          <CustomInput
            type={"password"}
            xs={12}
            md={6}
            label={"Password"}
            placeholder={"Create Your Password"}
            name="password"
            onChange={getUserData}
            value={values.password}
          />
          <CustomInput
            type={"password"}
            xs={12}
            md={6}
            label={"Confirm Password"}
            placeholder={"Confirm your Password"}
            name="confirmpassword"
            onChange={getUserData}
            value={values.confirmpassword}
          />
          <CustomInput
            type={"number"}
            xs={6}
            label={"Family Id"}
            placeholder={"Enter Your Family Id"}
            name="familyId"
            onChange={getUserData}
            value={values.familyId}
          />
          <CustomInput
            type={"date"}
            xs={6}
            label={"DOB"}
            placeholder={"Select Your DOB"}
            name="dob"
            onChange={getUserData}
            value={values.dob}
            focused
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-semibold"
              }
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </Grid>
          <Grid item xs={12}>
            <Typography className="flex justify-center">
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
      </Paper>
      <NotificationSnackbar notification={notification} />
    </Grid>
  );
}
