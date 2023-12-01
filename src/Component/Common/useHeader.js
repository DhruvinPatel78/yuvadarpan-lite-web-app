import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const useHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    signOut(auth)
      .then(async () => {
        await navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return {
    anchorEl,
    navigate,
    action: {
      handleMenu,
      handleClose,
      handleLogOut,
    },
  };
};

export default useHeader;
