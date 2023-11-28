import React from "react";
import { Box, Grid } from "@mui/material";
import CustomCard from "../Common/customCard";
import useDashboard from "./useDashboard";
import Header from "../Common/header";

export default function Dashboard() {
  const { navigate } = useDashboard();

  return (
    <Box>
      <Header />
      <Grid container spacing={2} className="p-4">
        <CustomCard title={"New Request"} action={() => navigate("/request")} />
        <CustomCard title={"User List"} action={() => navigate("/userlist")} />
        <CustomCard title={"Yuva List"} action={() => navigate("/yuvalist")} />
      </Grid>
    </Box>
  );
}
