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
  CityDetails,
  Country,
  CountryDetails,
  District,
  DistrictDetails,
  Native,
  Region,
  RegionDetails,
  Roles,
  Samaj,
  Surname,
  UserList,
  YuvaList,
  Request,
  State,
  StateDetails,
  AddYuva,
  AdminDashboard,
} from "./Pages/Admin";

import NewUser from "./Pages/User/NewUser";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./util/PrivateRoute";
import PublicRoute from "./util/PublicRoute";
import Home from "./Pages/User/Dashboard";
import ResetPassword from "./Pages/RestPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ChangePassword from "./Pages/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path={"/"}>
        {/*Public Routes*/}
        <Route path="login" exact element={<PublicRoute Component={Login} />} />
        <Route
          path="reset-password"
          exact
          element={<PublicRoute Component={ResetPassword} />}
        />
        <Route
          path="verify-opt"
          exact
          element={<PublicRoute Component={VerifyOtp} />}
        />
        <Route
          path="forget-password"
          exact
          element={<PublicRoute Component={ChangePassword} />}
        />
        <Route
          path="register"
          exact
          element={<PublicRoute Component={Registration} />}
        />
        <Route path="yuva/:id" exact element={<Profile />} />

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
          <Route path={"country"}>
            <Route index element={<PrivateRoute Component={Country} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={CountryDetails} />}
            />
          </Route>
          <Route path={"state"}>
            <Route index element={<PrivateRoute Component={State} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={StateDetails} />}
            />
          </Route>
          <Route path={"region"}>
            <Route index element={<PrivateRoute Component={Region} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={RegionDetails} />}
            />
          </Route>
          <Route path={"district"}>
            <Route index element={<PrivateRoute Component={District} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={DistrictDetails} />}
            />
          </Route>
          <Route path={"city"}>
            <Route index element={<PrivateRoute Component={City} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={CityDetails} />}
            />
          </Route>
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
