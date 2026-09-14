import React from "react";
import { Box } from "@mui/material";

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 0, md: 1 }, width: "100%" }}>{children}</Box>
      )}
    </div>
  );
};

export default CustomTabPanel;
