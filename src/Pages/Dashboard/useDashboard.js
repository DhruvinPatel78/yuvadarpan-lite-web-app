import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/useAxios";
import { useSelector } from "react-redux";
import FormData from "form-data"
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

  useEffect(() => {
    let data = new FormData();
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://gisem91frd.execute-api.us-east-2.amazonaws.com/test',
      headers: {
        'X-Amz-Date': `${process.env.REACT_APP_SECRET_KEY}`,
        'Authorization': `${process.env.REACT_APP_ACCESS_KEY}`,
        'Access-Control-Allow-Origin': '*'
      },
      data : data
    };

    axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
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
