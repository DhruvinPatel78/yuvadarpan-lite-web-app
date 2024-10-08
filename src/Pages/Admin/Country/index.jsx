import React from "react";
import Header from "../../../Component/Header";
import { Box, Grid } from "@mui/material";
import CustomCard from "../../../Component/Card";

export default function Index() {
  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <div className={"w-full"}>
          <Grid container spacing={2} className="p-4">
            <Grid item xs={12} sm={6} md={4}>
              <CustomCard title={"New"} />
            </Grid>
          </Grid>
        </div>
      </div>
    </Box>
  );
}
