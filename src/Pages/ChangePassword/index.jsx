import { Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import CustomInput from "../../Component/Common/customInput";

export default function Index() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary font-bold text-2xl">
              Change Password
            </p>
          </Grid>
          <CustomInput
            type={"password"}
            xs={12}
            label={"Password"}
            placeholder={"Enter Your Password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomInput
            type={"password"}
            xs={12}
            label={"Confirm Password"}
            placeholder={"Confirm your Password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={
                "pointer-events-auto bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center disabled:cursor-not-allowed"
              }
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
