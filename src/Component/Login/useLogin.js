import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const useLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });

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
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return {
    navigate,
    values,
    action: {
      getUserData,
      handleSubmit,
    },
  };
};

export default useLogin;
