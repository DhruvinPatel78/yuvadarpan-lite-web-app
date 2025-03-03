import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/index";
import Registration from "./Pages/Registration/index";
import ThankYou from "./Pages/ThankYou";
import Profile from "./Pages/Profile";
import Status from "./Pages/Status";
import {
  City,
  Country,
  District,
  Native,
  Region,
  Roles,
  Samaj,
  Surname,
  UserList,
  YuvaList,
  Request,
  State,
  AddYuva,
  AdminDashboard,
} from "./Pages/Admin";

import NewUser from "./Pages/User/NewUser";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./util/PrivateRoute";
import PublicRoute from "./util/PublicRoute";
import Home from "./Pages/User/Dashboard";

function App() {
  return (
    <Routes>
      <Route path={"/"}>
        {/*Public Routes*/}
        <Route path="login" exact element={<PublicRoute Component={Login} />} />
        <Route
          path="register"
          exact
          element={<PublicRoute Component={Registration} />}
        />

        {/*Private Routes*/}
        <Route index element={<PrivateRoute Component={Dashboard} />} />
        <Route
          path="pdf"
          exact
          element={<PrivateRoute Component={NewUser} />}
        />

        {/*Admin Routes*/}
        <Route path={"admin"}>
          <Route
            path="dashboard"
            exact
            element={<PrivateRoute Component={AdminDashboard} />}
          />
          <Route
            path="userlist"
            exact
            element={<PrivateRoute Component={UserList} />}
          />

          <Route path={"yuvalist"}>
            <Route index element={<PrivateRoute Component={YuvaList} />} />
            <Route
              path="add"
              exact
              element={<PrivateRoute Component={AddYuva} />}
            />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={Profile} />}
            />
            <Route
                path=":id/edit"
                exact
                element={<PrivateRoute Component={AddYuva} />}
            />
          </Route>

          <Route
            path="request"
            exact
            element={<PrivateRoute Component={Request} />}
          />
          <Route
            path="country"
            exact
            element={<PrivateRoute Component={Country} />}
          />
          <Route
            path="state"
            exact
            element={<PrivateRoute Component={State} />}
          />
          <Route
            path="region"
            exact
            element={<PrivateRoute Component={Region} />}
          />
          <Route
            path="district"
            exact
            element={<PrivateRoute Component={District} />}
          />
          <Route
            path="city"
            exact
            element={<PrivateRoute Component={City} />}
          />
          <Route
            path="samaj"
            exact
            element={<PrivateRoute Component={Samaj} />}
          />
          <Route
            path="surname"
            exact
            element={<PrivateRoute Component={Surname} />}
          />
          <Route
            path="native"
            exact
            element={<PrivateRoute Component={Native} />}
          />
          <Route
            path="role"
            exact
            element={<PrivateRoute Component={Roles} />}
          />
          <Route
            path="userDashboard"
            exact
            element={<PrivateRoute Component={Home} />}
          />
        </Route>

        <Route
          path="thankyou"
          exact
          element={<PublicRoute Component={ThankYou} skipCheck={true} />}
        />

        <Route
          path="status"
          exact
          element={<PrivateRoute Component={Status} />}
        />

        {/*404 not found*/}
        <Route path="*" exact={true} element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
