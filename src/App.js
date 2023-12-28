import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login/index";
import Registration from "./Component/Registration/index";
import Dashboard from "./Component/Dashboard/index";
import UserList from "./Component/UserList/index";
import YuvaList from "./Component/YuvaList/index";
import Request from "./Component/Request/index";
import UserDashboard from "./Component/UserDashboard/index";
import { auth } from "./firebase";

function App() {
  const navigate = useNavigate();
  const pathName = window.location.pathname;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(
          pathName === "/" || pathName === "/signin" || pathName === "/signup" ? "/dashboard" : pathName,
        );
      } else {
        navigate(['/yuvalist','/signup'].includes(pathName) ? pathName : "/");
      }
    });
  }, [navigate, pathName]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userlist" element={<UserList />} />
      <Route path="/yuvalist" element={<YuvaList />} />
      <Route path="/request" element={<Request />} />
      <Route path="/userDashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;
