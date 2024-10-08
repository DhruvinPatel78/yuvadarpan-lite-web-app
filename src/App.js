import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/index";
import Registration from "./Pages/Registration/index";
import AdminDashboard from "./Pages/Admin/Dashboard/index";
import UserList from "./Pages/Admin/UserList/index";
import YuvaList from "./Pages/Admin/YuvaList/index";
import Request from "./Pages/Admin/Request/index";
import ThankYou from "./Pages/ThankYou";
import AddYuva from "./Pages/AddYuva";
import Profile from "./Pages/Profile";
import Status from "./Pages/Status";
import Country from "./Pages/Admin/Country";
import State from "./Pages/Admin/State";
import Region from "./Pages/Admin/Region";
import District from "./Pages/Admin/District";
import City from "./Pages/Admin/City";
import Samaj from "./Pages/Admin/Samaj";

import NewUser from "./Pages/User/NewUser";
import Dashboard from "./Pages/User/Dashboard";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./Component/PrivateRoute";
import PublicRoute from "./Component/PublicRoute";

function App() {
  return (
    <Routes>
      {/* Admin Routes*/}
      <Route
        path="/"
        exact
        element={<PrivateRoute Component={AdminDashboard} />}
      />
      <Route path="/login" exact element={<PublicRoute Component={Login} />} />
      <Route
        path="/register"
        exact
        element={<PublicRoute Component={Registration} />}
      />

      <Route
        path="/admin/dashboard"
        exact
        element={<PrivateRoute Component={AdminDashboard} />}
      />
      <Route
        path="/admin/userlist"
        exact
        element={<PrivateRoute Component={UserList} />}
      />
      <Route
        path="/admin/yuvalist"
        exact
        element={<PrivateRoute Component={YuvaList} />}
      />
      <Route
        path="/admin/request"
        exact
        element={<PrivateRoute Component={Request} />}
      />
      <Route
        path="/admin/country"
        exact
        element={<PrivateRoute Component={Country} />}
      />
      <Route
        path="/admin/state"
        exact
        element={<PrivateRoute Component={State} />}
      />
      <Route
        path="/admin/region"
        exact
        element={<PrivateRoute Component={Region} />}
      />
      <Route
        path="/admin/district"
        exact
        element={<PrivateRoute Component={District} />}
      />
      <Route
        path="/admin/city"
        exact
        element={<PrivateRoute Component={City} />}
      />
      <Route
        path="/admin/samaj"
        exact
        element={<PrivateRoute Component={Samaj} />}
      />

      <Route
        path="/yuvalist/add"
        exact
        element={<PrivateRoute Component={AddYuva} />}
      />
      <Route
        path="/thankyou"
        exact
        element={<PublicRoute Component={ThankYou} />}
      />
      <Route
        path="/yuvalist/:id"
        exact
        element={<PrivateRoute Component={Profile} />}
      />
      <Route
        path="/status"
        exact
        element={<PrivateRoute Component={Status} />}
      />

      {/*User Routes*/}
      <Route path="/pdf" exact element={<PrivateRoute Component={NewUser} />} />
      <Route
        path="/dashboard"
        exact
        element={<PrivateRoute Component={Dashboard} />}
      />
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  );
}

export default App;
