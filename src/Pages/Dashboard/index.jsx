import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import CustomCard from "../../Component/Card";
import Header from "../../Component/Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../util/useAxios";
import { default as demoAxios } from "axios";

import FormData from "form-data"
export default function Index() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();
  const { loggedIn,user, } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }else{
      navigate(user.role === "ADMIN" ? "/" : "/pdf")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pendingListModalOpen = () => {
    setPendingListOpen(true);
  };

  const pendingListModalClose = () => {
    setPendingListOpen(false);
  };

  useEffect(() => {
    // axios.get(`${process.env.REACT_APP_BASE_URL}/yuva/list`).then((res) => {
    //   console.log("res =>", res);
    // });
  }, []);

  const sendOtpHandler = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/sendOtp`, {
        email: "patel.dhruvinpatel@gmail.com",
      })
      .then((res) => {
        console.log("REs - - - - - - >");
      })
      .catch((e) => console.log("e - - - - "));
  };
  return (
    <div>
      <Header />
      <Grid container spacing={2} className="p-4">
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title={"New Requests"}
            action={() => navigate("/request")}
          />
          {/*<button onClick={sendOtpHandler}>SendOtp</button>*/}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title={"User List"}
            action={() => navigate("/userlist")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title={"Yuva List"}
            action={() => navigate("/yuvalist")}
          />
        </Grid>
      </Grid>
    </div>
  );
}
