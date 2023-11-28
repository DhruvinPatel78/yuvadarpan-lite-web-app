import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log("user ==> ", user);
      if (user) {
        setUserName(user?.displayName);
        navigate("/dashboard");
      } else {
        setUserName("");
      }
    });
  }, [navigate]);

  const getUserData = (e) => {
    console.log("e => ", e);

    let name, value;

    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    console.log("e => ", e);
    const { email, password } = values;
    if (email === "" || password === "") {
      setErrorMsg("Please Fill all Fields.");
      return;
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          setErrorMsg("");
          navigate("/dashboard");
        })
        .catch((err) => {
          setErrorMsg(err.message);
        });
    }
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
