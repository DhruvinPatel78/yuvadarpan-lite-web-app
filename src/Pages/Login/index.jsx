import React, { useEffect, useState } from "react";
import {CircularProgress, Grid, Paper} from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import { useNavigate } from "react-router-dom";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useDispatch, useSelector } from "react-redux";
import { login, startLoading } from "../../store/authSlice";
import axios from "../../util/useAxios";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: "", password: "" });
  const { notification, setNotification } = NotificationData();
  const { loggedIn, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotification({ type: "", message: "" }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loggedIn) {
      console.log("loggedIn if")
      navigate(user?.role === "ADMIN" ? "/" : "/pdf");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    if (values.email && values.password) {
      dispatch(startLoading());
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/signIn`, {
          ...values,
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res?.data?.data));
          localStorage.setItem("token", res?.data?.token);
          dispatch(login({ ...res?.data?.data, token: res?.data?.token }));
          setNotification({ message: "Login Success", type: "success" });
          setTimeout(() => {
            setLoading(false);
            navigate(res?.data?.data?.role === "ADMIN" ? "/" : "/pdf");
          }, 1000);
        })
        .catch((err) => {
          console.log("Err =>", err);
          setTimeout(() => {
            setLoading(false);
            setNotification({
              message: err.response.data.message,
              type: err.response.status === "403" ? "warning" : "error",
            });
          }, 1000);
        });
    } else {
      setNotification({
        message:
          !values.email && !values.password
            ? "Email and Password are required."
            : !values.email
            ? "Email is required."
            : "Password is required.",
        type: "error",
      });
    }
  };

  return (

    <div className="h-screen flex flex-col justify-center items-center">
      <p className="text-center text-[#542b2b] text-3xl mb-10 font-extrabold font-WorkBold">
        YUVADARPAN
      </p>
      <Paper
        elevation={10}
        className="p-8 rounded-2xl w-full max-w-[90%] sm:w-full sm:max-w-[500px]"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <p className="text-center text-primary font-bold text-2xl">
              Sign In
            </p>
          </Grid>
          <CustomInput
            type={"text"}
            label={"Username"}
            placeholder={"Enter Your Username"}
            name="email"
            xs={12}
            onChange={getUserData}
            value={values.email}
          />
          <CustomInput
            type={"password"}
            label={"Password"}
            placeholder={"Enter Your Password"}
            name="password"
            xs={12}
            onChange={getUserData}
            value={values.password}
          />
          <Grid item xs={12}>
            {loading ? (
                <div className={"text-center text-primary"}>
                  <CircularProgress color="inherit" />
                </div>
            ) : (
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
              }
              onClick={handleSubmit}
            >
              Sign In
            </button>)}
          </Grid>
          <Grid item xs={12}>
            <p className="flex justify-center text-sm sm:text-lg cursor-default">
              Create a new account?
              <span
                className="px-1 text-[#572a2a] font-black no-underline text-sm sm:text-lg cursor-pointer"
                onClick={() => navigate("/register")}
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
