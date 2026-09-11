import React from "react";
import { Grid, styled, TextField } from "@mui/material";
const InfoTextField = styled((props) => (
  <TextField disabled InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: "#fff !important",
    border: "1px solid #d2c8c2",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&.Mui-focused": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiInputBase-input": {
    "@media (max-width: 767.95px)": {
      overflowWrap: "anywhere",
      wordBreak: "break-word",
    },
  },
  "& .MuiFormLabel-root": {
    color: "#6b6460 !important",
    fontWeight: "600",
    fontSize: "18px",
  },
  "& .MuiInputBase-input-MuiFilledInput-input.Mui-disabled": {
    color: "#6b6460",
  },
  "& .Mui-disabled": {
    opacity: 0.5,
  },
}));
const CustomTextFieldInfo = ({ grid, label, value }) => {
  return (
    <Grid
      item
      xs={grid}
      sx={{
        "@media (max-width: 767.95px)": {
          flexBasis: "100%",
          maxWidth: "100%",
          width: "100%",
        },
      }}
    >
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
