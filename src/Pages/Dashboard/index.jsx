import { useSelector } from "react-redux";
import { AdminDashboard } from "../Admin";
import Home from "../User/Dashboard";
import { isRegularUser } from "../../util/util";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return isRegularUser(user?.role) ? <Home /> : <AdminDashboard />;
};

export default Dashboard;
