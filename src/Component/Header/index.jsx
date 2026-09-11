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
  Container,
} from "@mui/material";
import { useState } from "react";
import useHeader from "./useHeader";
import FloatingButton from "../Common/FloatingButton";
import { UseRedux } from "../useRedux";
import FullPageLoader from "../Common/FullPageLoader";
import { YuvadarpanLogo } from "../Icons";

const menuItems = [
  { label: "Profile", path: "/profile" },
  { label: "Settings", path: "/settings" },
  { label: "Logout", action: "logout" },
];

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

  const handleMenuItem = (item) => {
    handleCloseUserMenu();
    if (item.action === "logout") {
      handleLogOut();
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <AppBar position="sticky" className={"bg-primary top-0 z-20 shadow-none"}>
      <Container className="max-w-[1600px]">
        <Toolbar disableGutters className={"justify-between min-h-[72px]"}>
          <YuvadarpanLogo
            className={"cursor-pointer !w-auto"}
            maxHeight={46}
            style={{ width: "auto", maxWidth: 320 }}
            onClick={() => navigate("/")}
            ariaLabel="Yuvadarpan home"
          />
          {user?.user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#fff",
                      color: "#542b2b",
                      fontWeight: 700,
                      width: 40,
                      height: 40,
                      fontSize: 15,
                      fontFamily: "WorkBold, 'Work Sans', sans-serif",
                    }}
                  >
                    {user?.user?.firstName &&
                      user?.user?.lastName &&
                      (
                        user?.user?.firstName[0] + user?.user?.lastName[0]
                      )?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .MuiPaper-root": {
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(84,43,43,0.12)",
                  },
                }}
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
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => handleMenuItem(item)}
                  >
                    <Typography textAlign="center" className="!text-primary !text-sm !font-WorkSemiBold">
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
      <FloatingButton />
      {loading ? <FullPageLoader /> : null}
    </AppBar>
  );
};
export default Header;
