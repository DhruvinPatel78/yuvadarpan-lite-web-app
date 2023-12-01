import React from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import CustomInput from "../Common/customInput";
import useRegistration from "./useRegistration";
import { NotificationSnackbar } from "../Common/notification";

export default function Registration() {
  const {
    notification,
    values,
    action: { getUserData, handleSubmit },
  } = useRegistration();
  return (
    <Grid className="h-screen flex justify-center items-center">
      <Paper elevation={20} className="w-2/5 p-8 !rounded-xl">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              className="text-center text-[#542b2b] !font-bold"
              variant="h3"
            >
              Registration
            </Typography>
          </Grid>
          <CustomInput
            type={"text"}
            grid={4}
            label={"First Name"}
            placeholder={"Enter Your First Name"}
            name="firstName"
            onChange={getUserData}
            value={values.firstName}
          />
          <CustomInput
            type={"text"}
            grid={4}
            label={"Middle Name"}
            placeholder={"Enter Your Middle Name"}
            name="middleName"
            onChange={getUserData}
            value={values.middleName}
          />
          <CustomInput
            type={"text"}
            grid={4}
            label={"Last Name"}
            placeholder={"Enter Your Last Name"}
            name="lastName"
            onChange={getUserData}
            value={values.lastName}
          />
          <CustomInput
            type={"text"}
            grid={6}
            label={"Email"}
            placeholder={"Enter Your Email"}
            name="email"
            onChange={getUserData}
            value={values.email}
          />
          <CustomInput
            type={"text"}
            grid={6}
            label={"Mobile"}
            placeholder={"Enter Your Mobile"}
            name="mobile"
            onChange={getUserData}
            value={values.mobile}
          />
          <CustomInput
            type={"password"}
            grid={6}
            label={"Password"}
            placeholder={"Create Your Password"}
            name="password"
            onChange={getUserData}
            value={values.password}
          />
          <CustomInput
            type={"password"}
            grid={6}
            label={"Confirm Password"}
            placeholder={"Confirm your Password"}
            name="confirmpassword"
            onChange={getUserData}
            value={values.confirmpassword}
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
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
                href={"/"}
                className="px-1 !text-[#572a2a] !font-black !no-underline"
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
