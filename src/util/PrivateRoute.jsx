import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { isRegularUser } from "./util";
import FamilyIdGate from "./FamilyIdGate";

const PrivateRoute = ({
  Component,
  userOnly = false,
  adminOnly = false,
  requireFamilyId = false,
}) => {
  const { loggedIn, user } = useSelector((state) => state.auth);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }
  if (userOnly && !isRegularUser(user?.role)) {
    return <Navigate to="/" replace />;
  }
  if (adminOnly && isRegularUser(user?.role)) {
    return <Navigate to="/" replace />;
  }

  const content = Component ? <Component /> : <Outlet />;
  if (requireFamilyId) {
    return <FamilyIdGate>{content}</FamilyIdGate>;
  }
  return content;
};

export default PrivateRoute;
