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
import FloatingButton from "../Common/FloatingButton";
import { UseRedux } from "../useRedux";
import FullPageLoader from "../Common/FullPageLoader";
import { YuvadarpanLogo } from "../Icons";

const settings = ["Logout"];

const Header = () => {
  const {
    user,
    navigate,
    action: { handleLogOut },
  } = useHeader();
  const { loading } = UseRedux();
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className={"bg-primary mb-4 sticky top-0 z-10"}>
      <ContainerPage>
        <Toolbar disableGutters className={"justify-between"}>
          <div className="logo-container">
            <YuvadarpanLogo
              className={"cursor-pointer"}
              onClick={() => navigate("/")}
            />
          </div>
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
      <FloatingButton />
      {loading ? <FullPageLoader /> : null}
    </AppBar>
  );
};
export default Header;
