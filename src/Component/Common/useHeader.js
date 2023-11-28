import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useHeader = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return {
    anchorEl,
    navigate,
    action: {
      handleClose,
    },
  };
};

export default useHeader;
