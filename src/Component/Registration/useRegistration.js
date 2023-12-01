import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { NotificationData } from "../Common/notification";

const useRegistration = () => {
  const [values, setValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const { notification, setNotification } = NotificationData();
  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = () => {
    if (values.password === values.confirmPassword) {
      try {
        const docRef = addDoc(collection(db, "users"), {
          firstName: values?.firstName,
          middleName: values?.middleName,
          lastName: values?.lastName,
          email: values?.email,
          mobile: values?.mobile,
          password: values?.password,
          active: false,
        });
        setValues({
          firstName: "",
          middleName: "",
          lastName: "",
          mobile: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        setNotification({ type: "success", message: "Success !" });
      } catch (e) {
        setNotification({
          type: "error",
          message: e.response.data.message,
        });
      }
    } else {
      setNotification({
        type: "error",
        message: "confirm password not matched !",
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

export default useRegistration;
