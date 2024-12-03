import { useSelector } from "react-redux";
import { AdminDashboard } from "../Admin";
import Home from "../User/Dashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return user.role === "ADMIN" ? <AdminDashboard /> : <Home />;
};

export default Dashboard;
