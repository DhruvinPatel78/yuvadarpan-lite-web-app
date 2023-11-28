import React from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import CustomInput from "../Common/customInput";

function Registration() {
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
            grid={4}
            label={"First Name"}
            placeholder={"Enter Your First Name"}
            name="fname"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={4}
            label={"Middle Name"}
            placeholder={"Enter Your Middle Name"}
            name="mname"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={4}
            label={"Last Name"}
            placeholder={"Enter Your Last Name"}
            name="lname"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={6}
            label={"Email"}
            placeholder={"Enter Your Email"}
            name="email"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={6}
            label={"Mobile"}
            placeholder={"Enter Your Mobile"}
            name="mobile"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={6}
            label={"Password"}
            placeholder={"Create Your Password"}
            name="psw"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            grid={6}
            label={"Confirm Password"}
            placeholder={"Confirm your Password"}
            name="cpsw"
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
              }
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
    </Grid>
  );
}

export default Registration;
