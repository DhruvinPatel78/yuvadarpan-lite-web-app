import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/index";
import Registration from "./Pages/Registration/index";
import AdminDashboard from "./Pages/Admin/Dashboard/index";
import UserList from "./Pages/Admin/UserList/index";
import YuvaList from "./Pages/Admin/YuvaList/index";
import Request from "./Pages/Admin/Request/index";
// import UserDashboard from "./Pages/UserDashboard/index";
import ThankYou from "./Pages/ThankYou";
import AddYuva from "./Pages/AddYuva";
import Profile from "./Pages/Profile";
import Status from "./Pages/Status";
// import { auth } from "./firebase";
import Country from "./Pages/Admin/Country";
import State from "./Pages/Admin/State";
import Region from "./Pages/Admin/Region";
import District from "./Pages/Admin/District";
import City from "./Pages/Admin/City";
import Samaj from "./Pages/Admin/Samaj";

import NewUser from "./Pages/User/NewUser";
import Dashboard from "./Pages/User/Dashboard";
import NotFound from "./Pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Admin Routes*/}
      <Route path="/" exact element={<AdminDashboard />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/register" exact element={<Registration />} />

      <Route path="/admin/dashboard" exact element={<AdminDashboard />} />
      <Route path="/admin/userlist" exact element={<UserList />} />
      <Route path="/admin/yuvalist" exact element={<YuvaList />} />
      <Route path="/admin/request" exact element={<Request />} />
      <Route path="/admin/country" exact element={<Country />} />
      <Route path="/admin/state" exact element={<State />} />
      <Route path="/admin/region" exact element={<Region />} />
      <Route path="/admin/district" exact element={<District />} />
      <Route path="/admin/city" exact element={<City />} />
      <Route path="/admin/samaj" exact element={<Samaj />} />

      <Route path="/yuvalist/add" exact element={<AddYuva />} />
      <Route path="/thankyou" exact element={<ThankYou />} />
      <Route path="/yuvalist/:id" exact element={<Profile />} />
      <Route path="/status" exact element={<Status />} />

      {/*User Routes*/}
      <Route path="/pdf" exact element={<NewUser />} />
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  );
}

export default App;
