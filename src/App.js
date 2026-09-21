import React, { useEffect, useState } from "react";
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
  BulkAddYuva,
  AdminDashboard,
  Logs,
  LogDetails,
  UserDetails,
} from "./Pages/Admin";
import Gotra from "./Pages/Admin/Gotra";

import NewUser from "./Pages/User/NewUser";
import Dashboard from "./Pages/Dashboard";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./util/PrivateRoute";
import PublicRoute from "./util/PublicRoute";
import Home from "./Pages/User/Dashboard";
import Shortlisted from "./Pages/User/Shortlist";
import ResetPassword from "./Pages/RestPassword";
import VerifyOtp from "./Pages/VerifyOtp";
import ChangePassword from "./Pages/ChangePassword";
import AccountProfile from "./Pages/Account/Profile";
import AccountSettings from "./Pages/Account/Settings";
import PwaInstallBanner from "./Component/PwaInstall";
import FullPageLoader from "./Component/Common/FullPageLoader";
import { FormLanguageProvider } from "./context/FormLanguageContext";
import { UseRedux } from "./Component/useRedux";
import { useDispatch } from "react-redux";
import { logout } from "./store/authSlice";
import { getCurrentUser } from "./util/userApi";
import { persistUpdatedUser } from "./Pages/Account/persistUser";
import { loadLocationMasters } from "./util/getAPICall";

function App() {
  const { loading } = UseRedux();
  const dispatch = useDispatch();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      setSessionReady(true);
      return;
    }
    getCurrentUser()
      .then((data) => {
        persistUpdatedUser(dispatch, { ...data, token }, data);
        loadLocationMasters(dispatch);
        setSessionReady(true);
      })
      .catch(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logout());
        setSessionReady(true);
      });
  }, [dispatch]);

  if (!sessionReady) {
    return null;
  }

  return (
    <FormLanguageProvider defaultLanguage="en">
    <>
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
          path="profile"
          exact
          element={<PrivateRoute Component={AccountProfile} />}
        />
        <Route
          path="shortlisted"
          exact
          element={<PrivateRoute Component={Shortlisted} userOnly />}
        />
        <Route
          path="settings"
          exact
          element={<PrivateRoute Component={AccountSettings} />}
        />
        <Route
          path="pdf"
          exact
          element={<PrivateRoute Component={NewUser} />}
        />

        {/*Admin Routes*/}
        <Route path={"admin"} element={<PrivateRoute adminOnly />}>
          <Route
            path="dashboard"
            exact
            element={<PrivateRoute Component={AdminDashboard} />}
          />
          <Route path={"userlist"}>
            <Route index element={<PrivateRoute Component={UserList} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={UserDetails} />}
            />
          </Route>
          <Route path={"logs"}>
            <Route index element={<PrivateRoute Component={Logs} />} />
            <Route
              path=":id"
              exact
              element={<PrivateRoute Component={LogDetails} />}
            />
          </Route>

          <Route path={"yuvalist"}>
            <Route index element={<PrivateRoute Component={YuvaList} />} />
            <Route
              path="add"
              exact
              element={<PrivateRoute Component={AddYuva} />}
            />
            <Route
              path="bulk-add"
              exact
              element={<PrivateRoute Component={BulkAddYuva} />}
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
            path="gotra"
            exact
            element={<PrivateRoute Component={Gotra} />}
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
      <PwaInstallBanner />
      {loading ? <FullPageLoader /> : null}
    </>
    </FormLanguageProvider>
  );
}

export default App;
