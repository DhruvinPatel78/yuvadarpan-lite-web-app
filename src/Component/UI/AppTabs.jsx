import React from "react";
import { Tabs, Tab, styled } from "@mui/material";
import { tokens } from "../../theme";

export const AppTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  width: "100%",
  minHeight: 40,
  borderBottom: `1px solid ${tokens.border}`,
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: tokens.primary,
  },
});

export const AppTab = styled((props) => <Tab disableRipple {...props} />)({
  textTransform: "none",
  fontFamily: "WorkSemiBold, 'Work Sans', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  minHeight: 40,
  paddingLeft: 12,
  paddingRight: 12,
  color: tokens.mutedText,
  "&.Mui-selected": {
    color: tokens.primary,
  },
});
