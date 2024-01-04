import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/useAxios";

const useDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pendingListModalOpen = () => {
    setPendingListOpen(true);
  };

  const pendingListModalClose = () => {
    setPendingListOpen(false);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/yuva/list`).then((res) => {
      console.log("res =>", res);
    });
  }, []);

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
