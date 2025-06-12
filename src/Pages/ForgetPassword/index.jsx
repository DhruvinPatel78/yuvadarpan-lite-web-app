import { Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import CustomInput from "../../Component/Common/customInput";

export default function Index() {
  const [email, setEmail] = useState("");

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary font-bold text-2xl">
              Forgot your password?
            </p>
          </Grid>
          <Grid item xs={12}>
            <p className={"text-center"}>
              Please enter the email address associated with your account and
              we'll email you a link to reset your password.
            </p>
          </Grid>
          <CustomInput
            type={"text"}
            xs={12}
            label={"Email"}
            placeholder={"Enter Your Email Address"}
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Grid item xs={12}>
            <Button
              variant="contained"
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center"
              }
            >
              Send Request
            </Button>
          </Grid>
          <Grid item xs={12}>
            <a
              href={"/login"}
              className={
                "text-primary w-full flex justify-center hover:underline"
              }
            >
              Return to sign in
            </a>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
