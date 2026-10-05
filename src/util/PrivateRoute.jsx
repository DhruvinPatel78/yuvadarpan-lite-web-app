import { Navigate, Outlet, useLocation } from "react-router-dom";
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
  const location = useLocation();

  if (!loggedIn) {
    const next = `${location.pathname}${location.search || ""}`;
    const loginTo =
      next && next !== "/"
        ? `/login?next=${encodeURIComponent(next)}`
        : "/login";
    return <Navigate to={loginTo} replace />;
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
