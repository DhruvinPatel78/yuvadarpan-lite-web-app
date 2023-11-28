import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login/login";
import Registration from "./Component/Registration/registration";
import Dashboard from "./Component/Dashboard/dashboard";
import UserList from "./Component/UserList/userList";
import YuvaList from "./Component/YuvaList/yuvaList";
import NewRequest from "./Component/Request/newRequest";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Registration />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userlist" element={<UserList />} />
      <Route path="/yuvalist" element={<YuvaList />} />
      <Route path="/request" element={<NewRequest />} />
    </Routes>
  );
}

export default App;
