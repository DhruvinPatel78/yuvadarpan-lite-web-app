import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/useAxios";
import { useSelector } from "react-redux";

const useDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pendingListOpen, setPendingListOpen] = useState(false);
  const navigate = useNavigate();
  const { loggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
