import { useEffect, useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../firebase";
import { NotificationData } from "../../Component/Common/notification";
import axios from "axios";

const useLogin = () => {
  // const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const { notification, setNotification } = NotificationData();

  useEffect(() => {
    setNotification({ type: "", message: "" }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/list`)
      .then((res) => console.log("res"));
    // const { email, password } = values;
    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     email === "admin@yuvadarpan.com" ? navigate("/dashboard") : navigate("/userDashboard");
    //     // const data={
    //     //   ...userCredential.user
    //     // }
    //     // localStorage.setItem("userDetails", JSON.stringify(data))
    //   })
    //   .catch((error) => {
    //     setNotification({
    //       type: "error",
    //       message: error.message,
    //     });
    //   });
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
