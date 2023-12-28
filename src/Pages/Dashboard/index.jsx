import React from "react";
import { Grid } from "@mui/material";
import CustomCard from "../../Component/Card";
import useDashboard from "./useDashboard";
import Header from "../../Component/Header";

export default function Index() {
  const { navigate } = useDashboard();

  return (
    <div>
      <Header />
      <Grid container spacing={2} className="p-4">
        <Grid item xs={12} sm={6} md={4}>
          <CustomCard
            title={"New Requests"}
            action={() => navigate("/request")}
          />
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
