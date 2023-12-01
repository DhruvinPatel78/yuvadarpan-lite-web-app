import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const useLogin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     console.log("user ==> ", user);
  //     if (user) {
  //       setUserName(user?.displayName);
  //       navigate("/dashboard");
  //     } else {
  //       setUserName("");
  //     }
  //   });
  // }, [navigate]);

  const getUserData = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return {
    navigate,
    errorMsg,
    values,
    userName,
    action: {
      getUserData,
      handleSubmit,
    },
  };
};

export default useLogin;
