import React from "react";
import { Grid, Paper } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import useLogin from "./useLogin";
import { useNavigate } from "react-router-dom";
import { NotificationSnackbar } from "../../Component/Common/notification";

export default function Index() {
  const navigate = useNavigate();
  const {
    notification,
    values,
    action: { getUserData, handleSubmit },
  } = useLogin();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-center text-[#542b2b] text-3xl mb-10 font-extrabold font-WorkBold">
        YUVADARPAN
      </p>
      <Paper elevation={10} className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary !font-bold text-2xl">
              Sign In
            </p>
          </Grid>
          <CustomInput
            type={"text"}
            label={"Username"}
            placeholder={"Enter Your Username"}
            name="email"
            grid={12}
            onChange={getUserData}
            value={values.email}
          />
          <CustomInput
            type={"password"}
            label={"Password"}
            placeholder={"Enter Your Password"}
            name="password"
            grid={12}
            onChange={getUserData}
            value={values.password}
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
              }
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </Grid>
          <Grid item xs={12}>
            <p className="flex justify-center text-sm sm:text-lg cursor-default">
              Create a new account?
              <span
                className="px-1 text-[#572a2a] font-black no-underline text-sm sm:text-lg cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Registration
              </span>
            </p>
          </Grid>
        </Grid>
      </Paper>
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
