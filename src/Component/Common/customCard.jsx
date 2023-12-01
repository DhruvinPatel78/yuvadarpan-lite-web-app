import React from "react";
import { Card } from "@mui/material";
// import { useNavigate } from "react-router-dom";

const CustomCard = ({ title, action }) => {
  return (
    <Card
      className="flex justify-center items-center font-bold h-28 cursor-pointer text-2xl uppercase text-[#223354] hover:bg-[#572a2a] hover:text-white hover:transition-all"
      variant="outlined"
      onClick={action}
    >
      <p>{title}</p>
    </Card>
  );
};

export default CustomCard;
