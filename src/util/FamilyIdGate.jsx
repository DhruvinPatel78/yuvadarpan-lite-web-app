import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isRegularUser } from "./util";
import FullPageLoader from "../Component/Common/FullPageLoader";

/** Gates USER routes when Family ID is missing from the master list. Admins skip. */
const FamilyIdGate = ({ children }) => {
  const { user, loggedIn, familyIdExists } = useSelector((state) => state.auth);

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (!isRegularUser(user?.role)) {
    return children;
  }
  if (familyIdExists === null) {
    return <FullPageLoader />;
  }
  if (!familyIdExists) {
    return <Navigate to="/connect-samaj" replace />;
  }
  return children;
};

export default FamilyIdGate;
