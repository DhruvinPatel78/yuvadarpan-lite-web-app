import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ Component }) => {
  const { loggedIn, user } = useSelector((state) => state.auth);
  const path = window.location.pathname;

  return loggedIn ? (
    path === "/" ? (
      <Navigate to={user.role === "USER" ? "/pdf" : "/admin/dashboard"} />
    ) : (
      <Component />
    )
  ) : (
    <Navigate to="/login" />
  );
};
export default PrivateRoute;
