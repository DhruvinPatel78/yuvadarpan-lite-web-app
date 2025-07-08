import { Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import CustomInput from "../../Component/Common/customInput";
import { useNavigate } from "react-router-dom";
import useAxios from "../../util/useAxios";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";

export default function Index() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { notification, setNotification } = NotificationData();
  const submitHandler = async () => {
    try {
      await useAxios
        .post(`/user/sendOtp`, {
          email,
        })
        .then(() => {
          setNotification({
            message: "OTP Send Successfully",
            type: "success",
          });
          navigate("/verify-opt", { state: { email: email } });
        })
        .catch((err) => {
          setNotification({
            message: err.response.data.message,
            type: "error",
          });
        });
    } catch (err) {
      setNotification({
        message: err.response.data.message,
        type: "error",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary font-bold text-2xl">
              Reset your password
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
                "pointer-events-auto bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold flex justify-center items-center disabled:cursor-not-allowed"
              }
              onClick={submitHandler}
            >
              Send OTP
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
      <NotificationSnackbar notification={notification} />
    </div>
  );
}
