import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import useHeader from "./useHeader";
import ContainerPage from "../Container";

const settings = ["Logout"];

const Header = () => {
  const {
    user,
    navigate,
    action: { handleLogOut },
  } = useHeader();
  // eslint-disable-next-line no-unused-vars
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className={"bg-primary mb-0 sm:mb-4"}>
      <ContainerPage>
        <Toolbar disableGutters className={"justify-between"}>
          <p
            className={
              "text-xl font-bold sm:text-2xl sm:font-extrabold cursor-pointer"
            }
            onClick={() => navigate("/")}
          >
            YUVADARPAN
          </p>

          {user?.user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    {user?.user?.firstName &&
                      user?.user?.lastName &&
                      (
                        user?.user?.firstName[0] + user?.user?.lastName[0]
                      )?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      handleLogOut();
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </ContainerPage>
    </AppBar>
  );
};
export default Header;
