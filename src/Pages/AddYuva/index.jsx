import Header from "../../Component/Header";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const AddYuva = () => {
  return (
    <Box>
      <Header backBtn={true} btnAction="/dashboard" />
      <div
        className={
          "px-6 pb-0 flex-col justify-center flex items-start max-w-[1536px] m-auto"
        }
      >
        <div className={"p-4 pb-0 flex w-full items-center justify-between"}>
          <p className={"text-3xl font-bold"}>Add Yuva</p>
        </div>
      </div>
    </Box>
  );
};

export default AddYuva;
