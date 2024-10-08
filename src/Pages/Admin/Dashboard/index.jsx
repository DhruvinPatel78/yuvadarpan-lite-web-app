import React, { useEffect, useState } from "react";
import { Grid, Container } from "@mui/material";
import CustomCard from "../../../Component/Card";
import Header from "../../../Component/Header";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/useAxios";

export default function Index() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();

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
      <Container maxWidth="xl">
        <Grid container spacing={2} className="p-4">
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"New Requests"}
              action={() => navigate("/admin/request")}
            />
            {/*<button onClick={sendOtpHandler}>SendOtp</button>*/}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"User List"}
              action={() => navigate("/admin/userlist")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"Yuva List"}
              action={() => navigate("/admin/yuvalist")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"Country"}
              action={() => navigate("/admin/country")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"State"}
              action={() => navigate("/admin/state")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"Region"}
              action={() => navigate("/admin/region")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"District"}
              action={() => navigate("/admin/district")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard title={"City"} action={() => navigate("/admin/city")} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              title={"Samaj"}
              action={() => navigate("/admin/samaj")}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
