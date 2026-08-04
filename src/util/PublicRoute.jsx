import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ Component, skipCheck = false }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  return skipCheck || !loggedIn ? <Component /> : <Navigate to="/" />;
};
export default PublicRoute;
