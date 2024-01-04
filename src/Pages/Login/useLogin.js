import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/useAxios";
import { NotificationData } from "../../Component/Common/notification";

const useLogin = () => {
  const navigate = useNavigate();
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
    if (values.email && values.password) {
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/signIn`, {
          ...values,
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          localStorage.setItem("token", res.data.token);
          setNotification({ message: "Login Success", type: "success" });
          navigate("/");
        })
        .catch((err) => {
          setNotification({
            message: err.response.data.message,
            type: err.response.status === "403" ? "warning" : "error",
          });
        });
    } else {
      setNotification({
        message:
          !values.email && !values.password
            ? "Email and Password are required."
            : !values.email
              ? "Email is required."
              : "Password is required.",
        type: "error",
      });
    }
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
