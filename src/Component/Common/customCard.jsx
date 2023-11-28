import React from "react";
import { Card, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";

const CustomCard = ({ title, action }) => {
  // const navigate = useNavigate();
  console.log("CustomeCArd ===> ", title, action);
  return (
    <Grid item xs={4}>
      <Card
        className="flex justify-center items-center font-bold h-28 cursor-pointer hover:scale-105 text-2xl uppercase text-[#223354]"
        variant="outlined"
        onClick={action}
      >
        {title}
      </Card>
    </Grid>
  );
};

export default CustomCard;
