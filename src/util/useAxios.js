import axios from "axios";

// const instance = axios.create();
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // headers: {
  //     "Content-Type": "application/json",
  // },
});

instance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("token")) {
      config.headers["Authorization"] = localStorage.getItem("token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// instance.interceptors.response.use(
//     (res) => res,
//     (err) => {
//         throw new Error(
//             err.response.data.error || "There was a problem processing your request"
//         );
//     }
// );

export default instance;
