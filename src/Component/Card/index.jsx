import React from "react";
import { Card } from "@mui/material";
// import { useNavigate } from "react-router-dom";

const CustomCard = ({ title, action }) => {
  return (
    <Card
      className="w-full flex justify-center items-center font-bold h-28 cursor-pointer text-2xl uppercase text-[#223354] transition-all duration-300 ease-in-out hover:bg-[#572a2a] hover:text-white"
      variant="outlined"
      onClick={action}
      aria-label={`Navigate to ${title}`}
    >
      <p>{title}</p>
    </Card>
  );
};

export default CustomCard;
