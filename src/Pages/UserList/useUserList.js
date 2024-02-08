import { useEffect, useState } from "react";
import { NotificationData } from "../../Component/Common/notification";
import axios from "../../util/useAxios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const useUserList = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { notification, setNotification } = NotificationData();
  const [userInfoModel, setRequestInfoModel] = useState(false);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      familyId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
      active: false,
      allowed: false,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log("Here");
        setLoading(true);
        const { confirmPassword, ...rest } = values;
        axios
          .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${rest._id}`, {
            ...rest,
          })
          .then((res) => {
            setUserList(res?.data?.map((data) => ({ ...data, id: data?._id })));
            userInfoModalClose();
          });
      } catch (e) {
        console.log("Error =>", e);
      } finally {
        setLoading(false);
      }
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      middleName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      familyId: Yup.number()
        .typeError("Must be a number")
        .positive()
        .required("Required"),
      mobile: Yup.number().typeError("Must be a number").required("Required"),
      email: Yup.string().email().required("Required"),
      password: Yup.string().required("Required"),
      confirmPassword: Yup.string()
        .required("Required")
        .test({
          message: "Password not match",
          test: function (value) {
            // You can access the price field with `this.parent`.
            return value === values.password;
          },
        }),
      // team1: Yup.number()
      //   .min(1, "Team 1 is required")
      //   .required("Team 1 is required"),
      // team2: Yup.number()
      //   .min(1, "Team 2 is required")
      //   .required("Team 2 is required"),
      // startTime: Yup.string().required("Match start time is required"),
      // winner: Yup.number().max(32, `Invalid Team`),
    }),
  });

  useEffect(() => {
    handleUserList();
  }, []);

  const {
    errors,
    touched,
    values,
    onSubmit,
    setValues,
    setFieldValue,
    resetForm,
  } = formik;

  const userInfoModalOpen = (userInfo) => {
    setRequestInfoModel(true);
    setValues({ ...userInfo, password: "" });
  };
  // const setUserData = (e) => {
  //   let name, value;
  //   name = e.target.name;
  //   value = e.target.value;
  //   setValues({ ...values, [name]: value });
  // };
  // const handleSubmit = () => {
  //   if (values.password === values.confirmpassword) {
  //     try {
  //       useAxios
  //         .post("/user/signUp", {
  //           familyId: values?.familyId,
  //           firstName: values?.firstName,
  //           middleName: values?.middleName,
  //           lastName: values?.lastName,
  //           email: values?.email,
  //           mobile: values?.mobile,
  //           password: values?.password,
  //           active: true,
  //           allowed: false,
  //           role: "USER",
  //         })
  //         .then((res) => {
  //           setValues(defaultValue);
  //           setNotification({ type: "success", message: "Success !" });
  //           navigate("/thankyou");
  //         });
  //     } catch (e) {
  //       setNotification({
  //         type: "error",
  //         message: e.response.data.message,
  //       });
  //     }
  //   } else {
  //     setNotification({
  //       type: "error",
  //       message: "confirm password not matched !",
  //     });
  //   }
  // };

  const userActionHandler = (userInfo, action, field) => {
    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/update/${userInfo._id}`, {
        ...userInfo,
        [field]: action,
      })
      .then((res) =>
        setUserList(res?.data?.map((data) => ({ ...data, id: data?._id }))),
      );
  };

  const userInfoModalClose = () => {
    setRequestInfoModel(false);
    resetForm();
  };
  const handleUserList = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/list`).then((res) => {
      setUserList(res.data.map((data) => ({ ...data, id: data?._id })));
    });
  };

  const fieldValueChangeHandler = (e) => {
    setFieldValue(e.target.name, e.target.value);
  };

  return {
    notification,
    userInfoModel,
    values,
    userList,
    navigate,
    formik,
    errors,
    touched,
    loading,
    action: {
      userInfoModalOpen,
      userInfoModalClose,
      handleUserList,
      userActionHandler,
      onSubmit,
      setFieldValue,
      fieldValueChangeHandler,
      // setUserData,
      // handleSubmit,
    },
  };
};

export default useUserList;
