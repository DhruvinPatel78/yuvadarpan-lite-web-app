import React, { useState } from "react";
import { CircularProgress, Grid, Paper } from "@mui/material";
import CustomInput from "../../Component/Common/customInput";
import { useNavigate } from "react-router-dom";
import {
  NotificationData,
  NotificationSnackbar,
} from "../../Component/Common/notification";
import { useDispatch, useSelector } from "react-redux";
import { login, startLoading, endLoading } from "../../store/authSlice";
import {
  getAllRegionData,
  getAllCityData,
  getAllDistrictData,
  getAllSamajData,
  getAllStateData,
  getAllSurnameData,
  getAllCountryData,
} from "../../util/getAPICall";
import axios from "../../util/useAxios";

export default function Index() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [values, setValues] = useState({ email: "", password: "" });
  const { notification, setNotification } = NotificationData();

  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    if (values.email && values.password) {
      dispatch(startLoading());
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/signIn`, {
          ...values,
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res?.data?.data));
          localStorage.setItem("token", res?.data?.token);
          setNotification({ message: "Login Success", type: "success" });
          setTimeout(() => {
            dispatch(endLoading());
            if (res.data?.data?.role === "USER") {
              dispatch(getAllCityData);
            } else {
              dispatch(getAllRegionData);
              dispatch(getAllCityData);
              dispatch(getAllDistrictData);
              dispatch(getAllSamajData);
              dispatch(getAllStateData);
              dispatch(getAllSurnameData);
              dispatch(getAllCountryData);
            }
            dispatch(login({ ...res?.data?.data, token: res?.data?.token }));
          }, 1000);
        })
        .catch((err) => {
          setTimeout(() => {
            dispatch(endLoading());
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
            disabled={loading}
          />
          <CustomInput
            type={"password"}
            label={"Password"}
            placeholder={"Enter Your Password"}
            name="password"
            xs={12}
            onChange={getUserData}
            value={values.password}
            disabled={loading}
          />
          <Grid item xs={12}>
            <button
              className={
                "bg-[#572a2a] text-white w-full p-2.5 pl-4 pr-4 normal-case text-base rounded-full font-bold"
              }
              style={
                values.password && values.email
                  ? { cursor: "pointer", opacity: "unset" }
                  : { disabled: true, cursor: "not-allowed", opacity: 0.5 }
              }
              onClick={loading ? () => {} : handleSubmit}
            >
              {loading ? <CircularProgress color="inherit" /> : "Sign In"}
            </button>
          </Grid>
          <Grid item xs={12}>
            <p className="flex justify-center text-sm sm:text-lg cursor-default">
              Create a new account?
              <span
                className={`px-1 font-black text-[#572a2a] no-underline text-sm sm:text-lg cursor-pointer`}
                onClick={loading ? () => {} : () => navigate("/register")}
                style={loading ? { opacity: 0.5 } : { opacity: "unset" }}
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
