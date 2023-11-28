import React from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomeCard = (title, action) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={4}>
      <CustomeCard
        className="flex justify-center items-center font-bold h-28 cursor-pointer hover:scale-105 text-2xl uppercase text-[#223354]"
        variant="outlined"
        action
      >
        {title}
      </CustomeCard>
    </Grid>
  );
};

export default CustomeCard;
