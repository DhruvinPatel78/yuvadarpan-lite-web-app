import React from "react";
import { Grid, styled, TextField } from "@mui/material";
const InfoTextField = styled((props) => (
  <TextField disabled InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#fff !important",
    border: "2px solid #c3c3c3",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&.Mui-focused": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiFormLabel-root": {
    color: "#657380 !important",
    fontWeight: "600",
    fontSize: "18px",
  },
  "& .MuiInputBase-input-MuiFilledInput-input.Mui-disabled": {
    color: "#657380",
  },
}));
const CustomTextFieldInfo = ({ grid, label, value }) => {
  return (
    <Grid item xs={grid}>
      <InfoTextField
        label={label}
        defaultValue={value}
        variant="filled"
        style={{ marginTop: 11, width: "100%" }}
      />
    </Grid>
  );
};

export default CustomTextFieldInfo;
