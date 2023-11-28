import React from "react";
import { Grid, Link, Paper, Typography } from "@mui/material";
import CustomInput from "../Common/customInput";

export default function Login() {
  return (
    <Grid className="h-screen flex justify-center items-center">
      <Paper elevation={10} className="p-8 !rounded-2xl w-2/5">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              className="text-center text-[#542b2b] !font-bold"
              variant="h3"
            >
              Sign In
            </Typography>
          </Grid>
          <CustomInput
            label={"Username"}
            placeholder={"Enter Your Username"}
            name="uname"
            grid={12}
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <CustomInput
            label={"Password"}
            placeholder={"Enter Your Password"}
            name="psw"
            grid={12}
            // onChange={getSeaServicesData}
            // value={seaServicesData.name}
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
              }
            >
              Sign In
            </button>
          </Grid>
          <Grid item xs={12}>
            <Typography className="flex justify-center">
              Create a new account ?{" "}
              <Link
                href={"/signup"}
                className="px-1 !text-[#572a2a] !font-black !no-underline"
              >
                Registration
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
