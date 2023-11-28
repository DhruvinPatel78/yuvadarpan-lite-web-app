import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pendingListModalOpen = () => {
    console.log("pendingListModalOpen");
    setPendingListOpen(true);
  };

  const pendingListModalClose = () => {
    setPendingListOpen(false);
  };
  return {
    anchorEl,
    pendingListOpen,
    navigate,
    action: {
      handleClose,
      pendingListModalOpen,
      pendingListModalClose,
    },
  };
};

export default useDashboard;
