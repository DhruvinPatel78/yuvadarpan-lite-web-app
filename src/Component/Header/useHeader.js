import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { clearLocation } from "../../store/locationSlice";

const useHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.auth);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    dispatch(logout());
    dispatch(clearLocation());
    localStorage.clear();
    navigate("/login");
  };
  return {
    anchorEl,
    navigate,
    user,
    action: {
      handleMenu,
      handleClose,
      handleLogOut,
    },
  };
};

export default useHeader;
