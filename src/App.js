import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login/login";
import Registration from "./Component/Registration/registration";
import Dashboard from "./Component/Dashboard/dashboard";
import UserList from "./Component/UserList/userList";
import YuvaList from "./Component/YuvaList/yuvaList";
import NewRequest from "./Component/Request/newRequest";
import { auth } from "./firebase";

function App() {
  const navigate = useNavigate();
  const pathName = window.location.pathname;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(
          pathName === "/" || pathName === "/signin" ? "/dashboard" : pathName,
        );
      } else {
        navigate(pathName === "/signup" ? pathName : "/");
      }
    });
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userlist" element={<UserList />} />
      <Route path="/yuvalist" element={<YuvaList />} />
      <Route path="/request" element={<NewRequest />} />
    </Routes>
  );
}

export default App;
