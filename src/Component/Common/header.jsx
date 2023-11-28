import React from "react";
import { AppBar, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import useHeader from "./useHeader";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function Header({ backBtn = false, btnAction }) {
  const {
    anchorEl,
    navigate,
    action: { handleClose },
  } = useHeader();
  return (
    <AppBar position="static" className="!bg-[#572a2a]">
      <Toolbar className={backBtn ? "justify-between" : "justify-end"}>
        {backBtn ? (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => navigate(btnAction)}
            color="inherit"
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
        ) : null}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          // onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
