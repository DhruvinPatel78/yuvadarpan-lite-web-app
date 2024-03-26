import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/index";
import Registration from "./Pages/Registration/index";
import Dashboard from "./Pages/Dashboard/index";
import UserList from "./Pages/UserList/index";
import YuvaList from "./Pages/YuvaList/index";
import Request from "./Pages/Request/index";
import UserDashboard from "./Pages/UserDashboard/index";
import ThankYou from "./Pages/ThankYou";
import AddYuva from "./Pages/AddYuva";
// import { auth } from "./firebase";

function App() {
  // const navigate = useNavigate();
  // const pathName = window.location.pathname;
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate(
  //         pathName === "/" || pathName === "/signin" || pathName === "/signup" ? "/dashboard" : pathName,
  //       );
  //     } else {
  //       navigate(['/yuvalist','/signup'].includes(pathName) ? pathName : "/");
  //     }
  //   });
  // }, [navigate, pathName]);
  return (
    <Routes>
      <Route path="/" exact element={<Dashboard />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/register" exact element={<Registration />} />
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="/userlist" exact element={<UserList />} />
      <Route path="/yuvalist" exact element={<YuvaList />} />
      <Route path="/yuvalist/add" exact element={<AddYuva />} />
      <Route path="/request" exact element={<Request />} />
      <Route path="/thankyou" exact element={<ThankYou />} />
      {/*<Route path="/userDashboard" element={<UserDashboard />} />*/}
    </Routes>
  );
}

export default App;
