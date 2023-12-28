import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {auth} from "../../firebase";

const useUserDashboard = () => {
  const navigate = useNavigate();
  const pathName = window.location.pathname;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user.email === "admin@yuvadarpan.com") {
        navigate("/dashboard");
      }
    });
  }, [navigate, pathName]);
  return {

  };
};

export default useUserDashboard;
