import { Navigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const safeNextPath = (raw) => {
  const value = String(raw || "").trim();
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
};

const PublicRoute = ({ Component, skipCheck = false }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  if (skipCheck || !loggedIn) {
    return <Component />;
  }

  const next = safeNextPath(searchParams.get("next"));
  return <Navigate to={next || "/"} replace />;
};

export default PublicRoute;
