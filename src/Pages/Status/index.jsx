import { useLocation } from "react-router-dom";

const Status = () => {
  const location = useLocation();
  console.log("Location", location);
  return <h1>Status</h1>;
};

export default Status;
