import React from "react";
import { Card, styled, Typography } from "@mui/material";
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
}));
const CustomCard = ({ title, action }) => {
  return (
    <StyledCard
      className="w-full flex justify-center items-center font-bold min-h-28 cursor-pointer text-2xl uppercase text-[#223354] transition-all duration-300 ease-in-out hover:bg-[#572a2a] hover:text-white"
      variant="outlined"
      onClick={action}
      aria-label={`Navigate to ${title}`}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 700, textAlign: "center" }}
      >
        {title}
      </Typography>
    </StyledCard>
  );
};

export default CustomCard;
