import React from "react";
import { Grid, TextField } from "@mui/material";

const CustomInput = ({ label, value, onChange, placeholder, name, grid }) => {
  return (
    <Grid item xs={grid}>
      <TextField
        label={label}
        placeholder={placeholder}
        name={name}
        // onChange={getUserData}
        // value={values.email}
        fullWidth
        required
      />
    </Grid>
  );
};

export default CustomInput;
