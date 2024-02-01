import { useState } from "react";
import { NotificationData } from "../../Component/Common/notification";
import useAxios from "../../util/useAxios";
import { useNavigate } from "react-router-dom";

const useRegistration = () => {
  const navigate = useNavigate();
  const defaultValue = {
    familyId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const [values, setValues] = useState(defaultValue);
  const { notification, setNotification } = NotificationData();
  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const handleSubmit = () => {
    if (values.password === values.confirmpassword) {
      try {
        useAxios
          .post("/user/signUp", {
            familyId: values?.familyId,
            firstName: values?.firstName,
            middleName: values?.middleName,
            lastName: values?.lastName,
            email: values?.email,
            mobile: values?.mobile,
            password: values?.password,
            active: true,
            allowed: false,
            role: "USER",
          })
          .then((res) => {
            setValues(defaultValue);
            setNotification({ type: "success", message: "Success !" });
            navigate("/thankyou");
          });
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
