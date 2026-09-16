import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isRegularUser } from "./util";

const PrivateRoute = ({ Component, userOnly = false }) => {
  const { loggedIn, user } = useSelector((state) => state.auth);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }
  if (userOnly && !isRegularUser(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return <Component />;
};
export default PrivateRoute;
