import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ Component, skipCheck = false }) => {
  const { loggedIn, user } = useSelector((state) => state.auth);
  return skipCheck || !loggedIn ? (
    <Component />
  ) : (
    <Navigate
      to={
        user?.role === "ADMIN" ||
        user?.role === "REGION_MANAGER" ||
        user?.role === "SAMAJ_MANAGER"
          ? "/"
          : "/pdf"
      }
    />
  );
};
export default PublicRoute;
