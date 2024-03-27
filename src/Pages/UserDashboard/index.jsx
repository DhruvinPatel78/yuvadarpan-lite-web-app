import React, { useEffect } from "react";
import Header from "../../Component/Header";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const UserDashboard = () => {
  // const {} = useUserDashboard();
  // const navigate = useNavigate();
  // const pathName = window.location.pathname;
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user.email === "admin@yuvadarpan.com") {
  //       navigate("/dashboard");
  //     }
  //   });
  // }, [navigate, pathName]);
  return (
    <div>
      <Header />
    </div>
  );
};

export default UserDashboard();
