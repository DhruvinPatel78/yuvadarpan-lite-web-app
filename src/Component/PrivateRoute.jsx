import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ Component }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  return loggedIn ? <Component /> : <Navigate to="/login" />;
};
export default PrivateRoute;
