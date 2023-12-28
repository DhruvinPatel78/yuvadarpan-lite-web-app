import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { NotificationData } from "../Common/notification";

const useLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const { notification, setNotification } = NotificationData();

  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        email === "admin@yuvadarpan.com" ? navigate("/dashboard") : navigate("/userDashboard");
        // const data={
        //   ...userCredential.user
        // }
        // localStorage.setItem("userDetails", JSON.stringify(data))
      })
      .catch((error) => {
        setNotification({
          type: "error",
          message: error.message,
        });
      });
  };
  return {
    notification,
    values,
    action: {
      getUserData,
      handleSubmit,
    },
  };
};

export default useLogin;
