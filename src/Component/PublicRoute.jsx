import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ Component }) => {
  const { loggedIn, user } = useSelector((state) => state.auth);
  return !loggedIn ? (
    <Component />
  ) : (
    <Navigate to={user?.role !== "ADMIN" ? "/pdf" : "/"} />
  );
};
export default PublicRoute;
